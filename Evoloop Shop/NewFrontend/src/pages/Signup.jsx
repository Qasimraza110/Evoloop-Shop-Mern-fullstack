import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await API.post("/auth/signup", data);
      const loginRes = await API.post("/auth/login", { email: data.email, password: data.password });
      login(loginRes.data.user, loginRes.data.token);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Join <span className="text-yellow-400">Evoloop Shop</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-md mx-auto">
          Create your account to enjoy a seamless shopping experience.
        </p>
      </div>

      {/* Signup Form */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        {serverError && (
          <p className="text-center text-red-600 font-medium">{serverError}</p>
        )}

        <input 
          {...register("username", { required: "Username is required" })} 
          placeholder="Username" 
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}

        <input 
          {...register("email", { required: "Email is required" })} 
          placeholder="Email" 
          type="email"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        <input 
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
          placeholder="Password" 
          type="password" 
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        <button 
          type="submit" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
        >
          Signup
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-500 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
