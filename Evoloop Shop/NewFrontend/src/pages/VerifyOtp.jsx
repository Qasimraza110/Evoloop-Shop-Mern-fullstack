// src/pages/VerifyOtp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function VerifyOtp({ email }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      
      login(res.data.user, res.data.token);
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4 text-gray-700">Enter the OTP sent to {email}</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="p-3 border rounded-lg mb-4"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleVerify}
        className="bg-yellow-400 hover:bg-yellow-500 py-2 px-6 rounded-lg font-semibold"
      >
        Verify OTP
      </button>
    </div>
  );
}
