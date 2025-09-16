import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },               
  otpExpires: { type: Date },         
  isVerified: { type: Boolean, default: false } ,
  resetPasswordToken: String,      
resetPasswordExpires: Date,      
}, { timestamps: true });

export default mongoose.model("User", userSchema);

