
// error types enum for consistent error handling
const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_ACTION: 'INVALID_ACTION',
  SAVE_LOAD_ERROR: 'SAVE_LOAD_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR'
};


 //creates a standardized error response object
const createErrorResponse = (status, code, message, details = null) => ({
  success: false,
  error: {
    status,
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  }
});

//global error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  //handle validation errors
  if (err.type === ErrorTypes.VALIDATION_ERROR || err.name === 'ValidationError') {
    return res.status(400).json(createErrorResponse(400, ErrorTypes.VALIDATION_ERROR, err.message, err.details));
  }

  //handle not found errors
  if (err.type === ErrorTypes.NOT_FOUND || err.name === 'NotFoundError') {
    return res.status(404).json(createErrorResponse(404, ErrorTypes.NOT_FOUND, err.message));
  }

  //handle rate limit errors
  if (err.type === ErrorTypes.RATE_LIMIT_ERROR || err.name === 'RateLimitError') {
    return res.status(429).json(createErrorResponse(429, ErrorTypes.RATE_LIMIT_ERROR, 'Too many requests, please try again later'));
  }

  //handle save/load errors
  if (err.type === ErrorTypes.SAVE_LOAD_ERROR) {
    return res.status(500).json(createErrorResponse(500, ErrorTypes.SAVE_LOAD_ERROR, err.message));
  }

  //handle all other errors
  res.status(500).json(createErrorResponse(500, ErrorTypes.SERVER_ERROR, 'Internal server error'));
}

module.exports = errorHandler; 