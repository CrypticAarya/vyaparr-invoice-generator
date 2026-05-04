import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JSON Web Tokens on protected routes.
 * Ensures that the requester is a valid, authenticated user.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Format should be "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication failed. Missing authorization token.' 
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'vyaparflow_super_secret_dev_key';

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
         return res.status(403).json({ success: false, error: 'Session expired. Please log in again.' });
      }
      return res.status(403).json({ success: false, error: 'Invalid or malformed token.' });
    }
    
    // Attach the decoded user payload (id, email) to the request object for downstream controllers
    req.user = decodedUser;
    next();
  });
};
