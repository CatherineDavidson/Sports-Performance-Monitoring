import React, { useState } from 'react';
import { Activity, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ usernameEmail: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      let result;
  
      // Check if the response is JSON
      if (response.ok) {
        // If response is JSON, parse it
        result = await response.json();
      } else {
        // If response is plain text, capture it
        result = await response.text();
      }
  
      // If the response is successful, handle login
      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
  
        // Redirect based on the user role
        if (result.role === "ADMIN") {
          navigate("/admindashboard");
        } else if (result.role === "ATHLETE") {
          navigate("/athletedashboard");
        } else if (result.role === "COACH") {
          navigate("/coachdashboard");
        }
      } else {
        // Handle errors based on the response from the backend
        if (result === "User not found") {
          setMessage("Error: User or Email not found.");
        } else if (result === "Wrong password") {
          setMessage("Error: Incorrect password.");
        } else {
          setMessage(`Error: ${result}`);  // Any other error message
        }
      }
    } catch (error) {
      setMessage("Error: Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div> <button
    onClick={() => navigate("/")}
    className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-colors"
  >
    <Home className="w-6 h-6 text-white" />
  </button>
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
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

        {/* Login Form */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <Activity className="w-12 h-12 text-blue-400" />
          </div>
         

          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                name="usernameEmail"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your username or email"
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
              <button
          type="button"
          style={{height:'30px',marginTop:'30px'}}
          onClick={togglePasswordVisibility}
         className="absolute inset-y-0 right-0 flex bg-transparent items-center px-3 py-1 text-black "
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate("/register")}
              className="text-white-400 hover:text-blue-300 transition-colors"
            >
              Don't have an account? Register here
            </button>
          </div>
        </div>
      </div>
    </div></div>
  );
};

export default Login;