import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token|| token==='undefined') {
    res.status(200);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

export { protect };
