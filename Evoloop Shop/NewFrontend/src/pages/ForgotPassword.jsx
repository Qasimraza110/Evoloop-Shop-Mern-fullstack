import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerMsg("");
    try {
      const res = await API.post("/auth/forgot-password", { email: data.email });
      setServerMsg(res.data.message);

     
      navigate("/verify-otp-reset", { state: { email: data.email } });
    } catch (err) {
      setServerMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        {serverMsg && <p className="text-center text-green-600">{serverMsg}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
            type="email"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}

