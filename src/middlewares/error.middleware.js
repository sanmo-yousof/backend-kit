const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    const errors = {};

    Object.keys(error.errors).forEach((field) => {
      errors[field] = error.errors[field].message;
    });

    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Custom AppError with validation errors
  if (error.errors) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: error.errors,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;