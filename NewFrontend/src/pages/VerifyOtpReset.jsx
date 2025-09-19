import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtpReset() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) navigate("/forgot-password"); 

  const onSubmit = async (data) => {
    setServerMsg("");
    try {
      
      await API.post("/auth/verify-otp-reset", { email, otp: data.otp });

   
      navigate("/reset-password", { state: { email, otp: data.otp } });
    } catch (err) {
      setServerMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
        {serverMsg && <p className="text-center text-red-600">{serverMsg}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("otp", { required: "OTP is required" })}
            placeholder="Enter OTP"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message}</span>}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
