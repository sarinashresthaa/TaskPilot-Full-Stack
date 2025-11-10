import React from "react";
import { FaKey, FaSignOutAlt } from "react-icons/fa";
import { useLogout } from "../../lib/auth/authQueries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileModal = (props) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/", { replace: true }); // Go to root, which will redirect to /home for logged out users
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("isLogin");
      navigate("/", { replace: true });
    }
  };
  const [changePassword, setChangePassword] = useState(false);

  return (
    <div className="absolute top-14 right-5 bg-white rounded-3xl shadow-xl w-80 p-6 z-50">
      {/* Profile Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-lg">{props.name}</h2>
          <p className="text-sm text-gray-500">{props.email}</p>
        </div>
      </div>

      <hr className="mb-1 text-gray-400" />

      {/* Options */}
      <div className="flex flex-col space-y-3">
       <button
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
          onClick={() => setChangePassword(true)}>
          <FaKey className="text-black" /> Change Password
        </button>
        
        <button className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-red-600" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
      {changePassword && (
        <ChangePasswordModal setChangePassword={setChangePassword} />
      )}
    </div>
  );
};

export default ProfileModal;
