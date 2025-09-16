import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await API.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.user, res.data.token);

      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      
      {/* Hero Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Welcome Back to <span className="text-yellow-400">Evoloop Shop</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-md mx-auto">
          Log in to access your account and enjoy seamless shopping experience.
        </p>
      </div>

      {/* Login Form */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        {serverError && (
          <p className="text-center text-red-600 font-medium">{serverError}</p>
        )}

        <input 
          {...register("email", { required: "Email is required" })} 
          placeholder="Email" 
          type="email"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        <input 
          {...register("password", { required: "Password is required" })} 
          placeholder="Password" 
          type="password" 
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          {/* Forgot Password Link */}
        <p className="text-right text-sm text-yellow-400 hover:text-yellow-500 cursor-pointer">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <button 
          type="submit" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>

        

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:text-yellow-500 font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
