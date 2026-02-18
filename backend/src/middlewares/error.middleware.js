export default (err, req, res, next) => {
  console.error('Error:', err);

  // Handle MySQL duplicate entry errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: "You are already registered for this event",
      error: "Duplicate registration"
    });
  }

  // Handle MySQL foreign key constraint errors
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      message: "Invalid event or user reference",
      error: "Foreign key constraint failed"
    });
  }

  // Handle MySQL table not found errors
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      message: "Database table not found. Please contact administrator.",
      error: "Table does not exist"
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
      error: "Validation failed"
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: "Invalid token",
      error: "Authentication failed"
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: "Token expired. Please login again.",
      error: "Token expired"
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
