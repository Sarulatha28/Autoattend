import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Company Portal</h1>
      <p className="mb-8 text-lg">Manage employees and admin access easily.</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-blue-500 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Signup
        </button>
        <button
          onClick={() => navigate("/signin")}
          className="bg-white text-purple-500 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Signin
        </button>
      </div>
    </div>
  );
};

export default Landing;
