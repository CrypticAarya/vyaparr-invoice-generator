import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errorMessages = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    res.status(400).json({
      success: false,
      errors: errorMessages,
    });
  }
};

export default validate;
