const jwt = require('jsonwebtoken');
const config = require('../config/index'); // Adjust the path to your config file

function authenticateToken(req, res, next) {
  // Extract the token from the x-access-token header
  const token = req.headers['x-access-token'];

  if (token == null) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.secretJwtToken, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized or invalid token' });
    }
    
    req.user = user; // Add the decoded token payload to the request object
    next(); // Proceed to the next middleware/route handler
  });
}

module.exports = authenticateToken;
