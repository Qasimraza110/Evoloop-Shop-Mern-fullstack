import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    API.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUserData(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h2>

        <div className="space-y-4">
          <div className="flex justify-between p-3 border rounded-lg bg-gray-50">
            <span className="font-medium text-gray-700">Username:</span>
            <span className="text-gray-900 font-semibold">{userData.username}</span>
          </div>

          <div className="flex justify-between p-3 border rounded-lg bg-gray-50">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900 font-semibold">{userData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
