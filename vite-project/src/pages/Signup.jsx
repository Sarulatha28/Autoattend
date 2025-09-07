// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyId: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        ...form,
        role: "admin", // force admin role
        deviceId: navigator.userAgent,
      });

      alert("Company registered successfully! Please login.");
      nav("/signin");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Company Sign Up</h2>

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="companyEmail"
          placeholder="Company Email"
          value={form.companyEmail}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="companyId"
          placeholder="Company ID (e.g. C001)"
          value={form.companyId}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Company Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register Company
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-green-500 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
