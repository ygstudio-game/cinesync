class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
// Usage example:
// const response = new ApiResponse(200, { user: "John Doe" }, "User fetched successfully");
// res.status(response.statusCode).json(response);
// This will create a consistent response structure for your API, making it easier to handle responses in your frontend or client applications.
