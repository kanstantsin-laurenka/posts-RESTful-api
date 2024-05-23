const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
      const error = new Error('Unauthorized');
      error.statusCode = 401
      next(error);
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    
    if (!decodedToken) {
      const error = new Error('Unauthorized');
      error.statusCode = 401
      next(error);
    }
    
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
}
