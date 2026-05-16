import logger from '../utils/LoggerService.js';
import rtracer from 'cls-rtracer';

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    requestId: rtracer.id(),
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    logger.error(`[CRITICAL] Request ${rtracer.id()} failed:`, err);
    res.status(500).json({
      success: false,
      message: 'A system error occurred. Our engineers have been notified.',
      errors: []
    });
  }
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.isOperational = err.isOperational;

    // Prisma Relational Errors
    if (error.code === 'P2002') {
      const field = error.meta?.target || 'unique field';
      error.message = `Conflict: ${field} already exists in our system.`;
      error.statusCode = 409;
      error.isOperational = true;
    }
    
    if (error.code === 'P2025') {
      error.message = 'The requested resource was not found in our records.';
      error.statusCode = 404;
      error.isOperational = true;
    }

    // JWT / Security Errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.message = 'Session invalid or expired. Please authenticate again.';
      error.statusCode = 401;
      error.isOperational = true;
    }

    // Validation Errors (Zod / Custom)
    if (error.name === 'ZodError') {
      error.message = 'Data validation failed. Please check your inputs.';
      error.errors = error.issues || [];
      error.statusCode = 400;
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

export default errorMiddleware;
