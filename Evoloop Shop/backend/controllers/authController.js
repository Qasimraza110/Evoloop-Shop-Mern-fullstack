import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) 
    return res.status(400).json({ message: "All fields required" });

  //  Email check
  const existingEmail = await User.findOne({ email });
  if (existingEmail) 
    return res.status(400).json({ message: "Email already registered" });

  //  Username check
  const existingUsername = await User.findOne({ username });
  if (existingUsername) 
    return res.status(400).json({ message: "Username already taken" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashed });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({
    message: "Signup success",
    token,
    user: { id: newUser._id, username: newUser.username, email: newUser.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
