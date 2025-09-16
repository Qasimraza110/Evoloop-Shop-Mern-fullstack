import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },               // store OTP
  otpExpires: { type: Date },          // expiration time
  isVerified: { type: Boolean, default: false } ,// email verified
  resetPasswordToken: String,       // new
resetPasswordExpires: Date,       // new
}, { timestamps: true });

export default mongoose.model("User", userSchema);
