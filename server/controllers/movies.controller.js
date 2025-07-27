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

export const batchGetTitles = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  console.log(ids);
  
  
  // Validate input
  if (!ids || !Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
    throw new ApiError(400, "Must provide 1-100 IMDb IDs in an array");
  }

  // Validate IMDb ID format
  const isValidImdbId = (id) => /^tt\d{7,}$/.test(id);
  const validIds = ids.filter(id => isValidImdbId(id));
  
  if (validIds.length === 0) {
    throw new ApiError(400, "Invalid IMDb ID format in provided array");
  }

  try {
    // Create custom params with multiple titleIds parameters
    const params = {
      ...(validIds.reduce((acc, id, index) => {
        acc[`titleIds[${index}]`] = id;
        return acc;
      }, {}))
    };

const response = await axios.get(`${IMDB_API_BASE}/titles:batchGet`, {
  params: {
    titleIds: validIds
  },
  paramsSerializer: (params) => {
    // Custom serializer that flattens titleIds correctly
    return Object.entries(params)
      .map(([key, value]) =>
        Array.isArray(value)
          ? value.map(v => `${key}=${encodeURIComponent(v)}`).join("&")
          : `${key}=${encodeURIComponent(value)}`
      )
      .join("&");
  }
});

    // Validate response has the expected structure
    if (!Array.isArray(response.data?.titles)) {
      throw new ApiError(502, "Invalid batch response structure from IMDb API");
    }

    // Find which requested IDs are missing from the response
    const returnedIds = new Set(response.data.titles.map(title => title.id));
    const missingIds = validIds.filter(id => !returnedIds.has(id));

    res.status(200).json(
      new ApiResponse("Batch titles retrieved", 200, {
        requestedCount: validIds.length,
        returnedCount: response.data.titles.length,
        missingIds,
        titles: response.data.titles
      })
    );
  } catch (error) {
    let status = 500;
    let message = "Batch lookup failed";
    let details = {
      validIds,
      apiEndpoint: `${IMDB_API_BASE}/titles:batchGet`
    };

    if (error.response) {
      status = error.response.status;
      message = `IMDb API error: ${error.response.statusText}`;
      details.apiError = error.response.data?.error || error.response.data;
    } else if (error.request) {
      message = "No response received from IMDb API";
    } else {
      message = `Request setup error: ${error.message}`;
    }

    throw new ApiError(status, message, details);
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