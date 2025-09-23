import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  if (!email || !otp) navigate("/forgot-password"); 

  const onSubmit = async (data) => {
    setServerMsg("");
    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword: data.newPassword
      });
      setServerMsg("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setServerMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
        {serverMsg && <p className="text-center text-green-600">{serverMsg}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            placeholder="New Password"
            type="password"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

