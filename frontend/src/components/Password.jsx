import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Password = ({ name, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        id="password"
        name={name}
        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
        type={showPassword ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-purple-700">
        {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
      </button>
    </div>
  );
};

export default Password;
