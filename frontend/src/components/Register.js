import React, { useState } from 'react';
import { UserPlus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "ATHLETE",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePassword = (password) => {
    if (password.length <1){
      setPasswordError("");
    }else if ((password.length < 8) || password.length > 20) {
      setPasswordError("Password must be between 8 and 20 characters.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError("");
    }
    
  };

  const validateConfirmPassword = (confirmPassword) => {
    
    if (confirmPassword !== formData.password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };
  const validateUsername = (username) => {
    if (username.length <1){
      setUsernameError("");
    }else if (username.length < 3 || username.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters.");
    } else if (!/^[A-Za-z0-9._-]+$/.test(username)) {
      setUsernameError(
        "Username can only contain letters, numbers, dots, underscores, and hyphens."
      );
    } else {
      setUsernameError("");
    }
  };
  
  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (email.length <1){
      setEmailError("");
    }else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.text();
      setMessage(response.ok ? `Registration successful: ${result}` : `Error: ${result}`);
      if (response.ok) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-colors"
      >
        <Home className="w-6 h-6 text-white" />
      </button>
      <div className="relative w-full max-w-md">
        {/* Home button */}


        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute animate-spin-slow" viewBox="0 0 100 100" width="400" height="400">
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* Register Form */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <UserPlus className="w-12 h-12 text-blue-400" />
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
           {/* Username Field */}
<div>
  <label className="block text-sm font-medium text-gray-300 mb-1">
    Username
  </label>
  <input
    type="text"
    name="username"
    value={formData.username}
    onChange={(e) => {
      handleChange(e);
      validateUsername(e.target.value); // Custom function to validate username
    }}
    className={`w-full px-4 py-2 bg-white/10 border ${
      usernameError ? "border-red-500" : "border-gray-600"
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400`}
    placeholder="Choose a username"
    required
  />
  {usernameError && (
    <p className="text-red-400 text-sm mt-1">{usernameError}</p>
  )}
</div>

{/* Email Field */}
<div>
  <label className="block text-sm font-medium text-gray-300 mb-1">
    Email
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={(e) => {
      handleChange(e);
      validateEmail(e.target.value); // Custom function to validate email
    }}
    className={`w-full px-4 py-2 bg-white/10 border ${
      emailError ? "border-red-500" : "border-gray-600"
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400`}
    placeholder="Enter your email"
    required
  />
  {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
</div>


           {/* Password Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={(e) => {
            handleChange(e);
            validatePassword(e.target.value);
          }}
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Create a password"
          required
        />
        {/* <button
          type="button"
          onClick={() => togglePasswordVisibility("password")}
          className="top-2 right-3 absolute inset-y-0 right-0 flex bg-transparent items-center px-3 py-1 text-black"
          style={{ height: "30px", marginTop: "30px" }}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </button> */}
        {passwordError && (
          <p className="text-red-400 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => {
            handleChange(e);
            validateConfirmPassword(e.target.value);
          }}
          className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Re-enter your password"
          required
        />
        {/* <button
          type="button"
          onClick={() => togglePasswordVisibility("confirmPassword")}
          className="top-2 right-3 absolute inset-y-0 right-0 flex bg-transparent items-center px-3 py-1 text-black"
          style={{ height: "30px", marginTop: "30px" }}
        >
          {showConfirmPassword ? <Eye /> : <EyeOff />}
        </button> */}
        {confirmPasswordError && (
          <p className="text-red-400 text-sm mt-1">{confirmPasswordError}</p>
        )}
      </div>
            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{backgroundColor:'white',color:'black'}}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black hover:text-white hover:bg-blue-500 transition-colors"
              >
                <option value="ATHLETE" className="bg-white text-black">Athlete</option>
                <option value="COACH" className="bg-whitw text-black">Coach</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-white-400 hover:text-blue-300 transition-colors"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;