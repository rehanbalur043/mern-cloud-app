const axios = require('axios');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    if (response.data.success) {
      req.user = response.data.user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.response?.data?.message || error.message
    });
  }
};

exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};
