import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import { cloudinary } from '../utils/cloudinary.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// ===============================
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password, location } = req.body;

  // 1. Check if user exists
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists!');
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(password, salt);

  // 3. Create user
  const user = await User.create({
    username,
    email,
    password: hashpass,
    location,
  });

  // 4. Send cookie and return user info
  if (user) {
   res.cookie('token', generateToken(user._id), {
  httpOnly: true,
  secure: true,               // ensures HTTPS only
  sameSite: 'None',           // must be 'None' for cross-site cookies
  domain: '.onrender.com',    // optional but helps with subdomain issues
  maxAge: 24 * 60 * 60 * 1000,
});
      .status(201)
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        location: user.location,
      });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({message:"user not found"});
    
  }

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Password mismatching!');
  }

  // 3. Set cookie and return user
 res.cookie('token', generateToken(user._id), {
  httpOnly: true,
  secure: true,               // ensures HTTPS only
  sameSite: 'None',           // must be 'None' for cross-site cookies
  domain: '.onrender.com',    // optional but helps with subdomain issues
  maxAge: 24 * 60 * 60 * 1000,
});
    .status(200)
    .json({
      id: user._id,
      username: user.username,
      email: user.email,
      location: user.location,
      avatar: user.avatar
    });
});

const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
 
  if (!user) {
    res.status(200).json({ message: "user not logged in" })
  }
  res.status(200).json({ user })
})

const updateProfile = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🗑 Delete old image if it exists
    if (user.avatarPublicId && user.avatar?.includes("res.cloudinary.com")) {
     
      const result = await cloudinary.uploader.destroy(user.avatarPublicId);
     
    }

    // ✏️ Update username and location
    user.username = req.body.username || user.username;
    user.location = req.body.location || user.location;

    // 🆕 Upload new avatar
    if (req.file && req.file.path) {
      user.avatar = req.file.path; // Cloudinary URL
      user.avatarPublicId = req.file.filename; // Already includes folder name like: user_avatars/...
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });  

  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});





export { register, login, getMe, updateProfile };
