import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const IMDB_API_BASE = "https://api.imdbapi.dev";

// Search titles with advanced filtering
export const searchTitles = asyncHandler(async (req, res) => {
  const { query, limit = 10, type, genre, year } = req.query;

  if (!query) throw new ApiError(400, "Search query is required");

  try {
    let params = { query, limit };
    if (type) params.type = type;
    if (genre) params.genre = genre;
    if (year) params.year = year;

    const response = await axios.get(`${IMDB_API_BASE}/search/titles`, {
      params
    });

    if (!response.data.titles) throw new ApiError(404, "No titles found");

    // Filter out adult content
    const filtered = response.data.titles.filter(title => !title.isAdult);
    
    res.status(200).json(
      new ApiResponse("Titles retrieved", 200, {
        count: filtered.length,
        titles: filtered
      })
    );
  } catch (error) {
    throw new ApiError(500, "IMDb API error", error.message);
  }
});

// Batch title lookup
export const batchGetTitles = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
    throw new ApiError(400, "Invalid IDs array (max 50 items)");
  }

  try {
    const response = await axios.post(`${IMDB_API_BASE}/titles:batchGet`, { ids });
    
    res.status(200).json(
      new ApiResponse("Batch titles retrieved", 200, response.data.titles)
    );
  } catch (error) {
    throw new ApiError(500, "Batch lookup failed", error.message);
  }
});

// Get detailed title information
export const getTitleDetails = asyncHandler(async (req, res) => {
  const { titleId } = req.params;

  try {
    const requests = [
      axios.get(`${IMDB_API_BASE}/titles/${titleId}`),
      axios.get(`${IMDB_API_BASE}/titles/${titleId}/credits`),
      axios.get(`${IMDB_API_BASE}/titles/${titleId}/parentsGuide`)
    ];

    const [details, credits, parentsGuide] = await Promise.all(requests);

    const data = {
      ...details.data,
      credits: credits.data.credits || [],
      parentsGuide: parentsGuide.data.categories || []
    };

    res.status(200).json(new ApiResponse("Title details", 200, data));
  } catch (error) {
    throw new ApiError(404, "Title not found", error.message);
  }
});

// Get episodes for a TV series
export const getTitleEpisodes = asyncHandler(async (req, res) => {
  const { titleId } = req.params;
  const { season } = req.query;

  try {
    if (!season) {
      // Get all seasons
      const seasonsRes = await axios.get(`${IMDB_API_BASE}/titles/${titleId}/seasons`);
      return res.json(new ApiResponse("Seasons data", 200, seasonsRes.data.seasons));
    }

    // Get specific season episodes
    const episodesRes = await axios.get(`${IMDB_API_BASE}/titles/${titleId}/episodes`, {
      params: { season }
    });

    res.json(new ApiResponse("Episodes data", 200, episodesRes.data.episodes));
  } catch (error) {
    throw new ApiError(404, "Episodes not found", error.message);
  }
});

// Get title certifications with filtering
export const getCertifications = asyncHandler(async (req, res) => {
  const { titleId } = req.params;
  const { country = "US" } = req.query;

  try {
    const response = await axios.get(`${IMDB_API_BASE}/titles/${titleId}/certificates`);
    
    // Filter by country if provided
    const filtered = country 
      ? response.data.certificates.filter(c => 
          c.country?.code.includes(country.toUpperCase()))
      : response.data.certificates;

    res.json(new ApiResponse("Certifications", 200, filtered));
  } catch (error) {
    throw new ApiError(404, "Certifications not found", error.message);
  }
});