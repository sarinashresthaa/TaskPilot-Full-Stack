import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/auth/authQueries";
import { api } from "../lib/auth/authQueries";
import { useQueryClient } from "@tanstack/react-query";

const Settings = () => {
  const { data: authData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    if (authData?.user) {
      setFormData({
        name: authData.user.name || "",
        email: authData.user.email || "",
        phone: authData.user.phone || "",
        department: authData.user.department || "",
      });
    }
  }, [authData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.put("/auth/profile", formData);
      setMessage("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const user = authData?.user;

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#7D3BEC] text-white rounded-lg hover:bg-purple-700"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Personal Information
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7D3BEC] text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <p className="text-gray-800 mt-1">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-800 mt-1">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <p className="text-gray-800 mt-1">{user.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <p className="text-gray-800 mt-1">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Department
                  </label>
                  <p className="text-gray-800 mt-1">
                    {user.department || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Account Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <p className="text-gray-800 mt-1 capitalize">
                {user.role?.replace("_", " ")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Account Status
              </label>
              <span
                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                  user.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Member Since
              </label>
              <p className="text-gray-800 mt-1">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last Login
              </label>
              <p className="text-gray-800 mt-1">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
