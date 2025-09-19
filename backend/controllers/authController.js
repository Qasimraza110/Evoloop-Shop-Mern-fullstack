import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/email.js";



//  Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).json({ message: "Email already registered" });

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.status(400).json({ message: "Username already taken" });

  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOtp();

  const newUser = await User.create({
    username,
    email,
    password: hashed,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000,
    isVerified: false,
  });

  await sendOtpEmail(email, otp);

  res.status(201).json({ message: "OTP sent to your email. Please verify to continue." });
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

  user.otp = null;
  user.otpExpires = null;
  user.isVerified = true;
  await user.save();

  const token = generateToken(user._id);
  res.json({
    message: "Email verified successfully",
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, username: user.username, email: user.email },
  });
};

//  Get Profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

//  Update Profile (username/email)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};
// Forgot Password - send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  
  console.log(`OTP for ${email}: ${otp}`);



  res.json({ message: "OTP generated. Check console for OTP in development." });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.otp) return res.status(400).json({ message: "No OTP found. Request a new one." });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
};

// Verify OTP for Reset
export const verifyOtpReset = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.otp) return res.status(400).json({ message: "No OTP found. Please request a new one." });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

  // OTP verified, allow user to reset password
  res.json({ message: "OTP verified. You can reset your password now." });
};
