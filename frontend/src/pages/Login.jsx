import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../lib/auth/authQueries";

const LoginPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("")

    const login = useLogin()

    // Get the intended destination, default to dashboard
    const from = location.state?.from?.pathname || "/dashboard"

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("")

        try {
            await login.mutateAsync({
                email: email,
                password: password,
            })
            // Navigate to where user was trying to go, or dashboard
            navigate(from, { replace: true })
        } catch (error) {
            console.error('Login Error', error)
            setError(error.response?.data?.message || "Login failed. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center px-10">
            {/* Left Side */}
            <div className="bg-[#7D3BEC] rounded-l-2xl p-10 text-white flex flex-col justify-between max-w-md w-full h-[480px] shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold leading-tight mb-2 lg:text-4xl">
                        Simplify <br />
                        management with <br />
                        our dashboard
                    </h1>
                    <p className="text-sm font-light">
                        “Where planning meets productivity”
                    </p>
                </div>
                <div className="flex justify-center">
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/task-management-3d-icon-png-download-4639150.png?f=webp"
                        alt="Animated characters"
                        className="h-84 object-fit"
                    />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-gray-100 max-w-md w-full px-8 py-24 rounded-r-2xl h-[480px] shadow-xl">
                <h2 className="text-lg font-bold mb-1 text-center">
                    Welcome to 🚀 Task<span className="text-[#7D3BEC]">Pilot</span>
                </h2>
                <p className="text-xs text-center mb-7">Please login to continue</p>

                <form className="space-y-6 max-w-md mx-auto" onSubmit={submitHandler}>
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-700"

                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input with Eye Toggle */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                        >
                            Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
                                type={showPassword ? "text" : "password"}
                                required
                                onChange={(e) => setPassword(e.target.value)}

                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-purple-700"
                            >
                                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-xs text-right mb-3">
                        <button
                            type="button"
                            className="underline text-gray-600 hover:text-purple-700"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#7D3BEC] text-white rounded-md py-2 font-semibold hover:bg-purple-600 transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
