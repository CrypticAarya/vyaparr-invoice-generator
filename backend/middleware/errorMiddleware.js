const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
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
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went very wrong!',
      errors: []
    });
  }
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error.message = `Invalid ${error.path}: ${error.value}.`;
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (error.code === 11000) {
      const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      error.message = `Duplicate field value: ${value}. Please use another value!`;
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map((el) => el.message);
      error.message = `Invalid input data. ${errors.join('. ')}`;
      error.statusCode = 400;
      error.isOperational = true;
    }
    // Prisma Error Handling
    if (error.code === 'P2002') {
      const field = error.meta?.target || 'field';
      error.message = `Duplicate value for ${field}. Please use another value!`;
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (error.code === 'P2025') {
      error.message = 'Record not found.';
      error.statusCode = 404;
      error.isOperational = true;
    }

    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token. Please log in again!';
      error.statusCode = 401;
      error.isOperational = true;
    }
    if (error.name === 'TokenExpiredError') {
      error.message = 'Your token has expired! Please log in again.';
      error.statusCode = 401;
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

export default errorMiddleware;
