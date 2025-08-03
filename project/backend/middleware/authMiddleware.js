import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const protect = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token|| token==='undefined') {
     return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
     return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
