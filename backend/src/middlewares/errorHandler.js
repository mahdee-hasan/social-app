import createError from "http-errors";
// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found!"));
};

// Default Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  // If its  Development then show error details, but in production just message
  const errorResponse = {
    success: false,
    status,
    message: err.message || "Something went wrong!",
  };

  if (process.env.NODE_ENV === "dev") {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};
export { notFoundHandler, errorHandler };
