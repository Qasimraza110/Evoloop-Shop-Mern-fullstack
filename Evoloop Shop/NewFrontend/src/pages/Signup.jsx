import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api";
import VerifyOtp from "./VerifyOtp";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [emailForOtp, setEmailForOtp] = useState(null); 

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await API.post("/auth/signup", data); 
      setEmailForOtp(data.email); 
    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    }
  };

  // If email is set, show OTP verification
  if (emailForOtp) return <VerifyOtp email={emailForOtp} />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Join <span className="text-yellow-400">Evoloop Shop</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-md mx-auto text-sm sm:text-base">
          Create your account to enjoy a seamless shopping experience.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        {serverError && (
          <p className="text-center text-red-600 font-medium">{serverError}</p>
        )}

        <div className="flex flex-col">
          <input 
            {...register("username", { required: "Username is required" })} 
            placeholder="Username" 
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>}
        </div>

        <div className="flex flex-col">
          <input 
            {...register("email", { required: "Email is required" })} 
            placeholder="Email" 
            type="email"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col">
          <input 
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Password must be at least 6 characters" } 
            })} 
            placeholder="Password" 
            type="password" 
            className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
        </div>

        <button 
          type="submit" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
