const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
// Usage example:
// app.get('/api/data', asyncHandler(async (req, res) => {
//   const data = await fetchDataFromDatabase();
//   res.json(data);
// }));
// This utility function wraps your route handlers to automatically catch errors and pass them to the next middleware, which can be an error handler.
// This helps keep your code cleaner and avoids repetitive try-catch blocks in every route handler.
// Make sure to use this utility in your route definitions.
