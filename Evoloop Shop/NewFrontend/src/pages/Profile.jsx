import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    API.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUserData(res.data);
        setFormData({ username: res.data.username, email: res.data.email });
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(
        "/auth/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(data);
      setEditMode(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        "/auth/change-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      toast.error("Password change failed!");
    }
  };

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
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h2>

        {!editMode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <FaUser /> Username:
              </span>
              <span className="text-gray-900 font-semibold">{userData.username}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <FaEnvelope /> Email:
              </span>
              <span className="text-gray-900 font-semibold">{userData.email}</span>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-md border bg-gray-50 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border bg-gray-50 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Change Password */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaLock /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Old Password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-md border bg-gray-50 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-md border bg-gray-50 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
