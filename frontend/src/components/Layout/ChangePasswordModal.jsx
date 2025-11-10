import React, { useState } from "react";
import { api } from "../../lib/auth/authQueries";
import { useQueryClient } from "@tanstack/react-query";
import Password from "../Password";

const ChangePasswordModal = ({ setChangePassword }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.put("/auth/profile", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setSuccess("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePassword(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      {/* Modal Box */}
      <div className="bg-white max-h-[600px] overflow-auto shadow-lg rounded-2xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button
            onClick={() => setChangePassword(false)}
            className="text-red-500 font-bold text-xl hover:text-red-600 cursor-pointer">
            ✕
          </button>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <Password
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <Password
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7D3BEC] text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all duration-200">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
