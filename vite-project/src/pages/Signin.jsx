// src/pages/Signin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = ({ onLogin }) => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyId: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", form);
      const { token, employee, role } = res.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("employee", JSON.stringify(employee));

      // Call parent callback if provided
      if (onLogin) onLogin(employee);

      // Navigate based on role
      if (role === "admin") nav("/admin");
      else nav("/employee");
    } catch (err) {
      alert(err?.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Sign In</h2>

        <input
          type="text"
          name="companyId"
          placeholder="Company ID"
          value={form.companyId}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Sign In
        </button>

        <p className="mt-4 text-center">
          New?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signin;
