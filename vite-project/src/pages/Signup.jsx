import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "employee" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      if(res.data.role === "admin") nav("/admin");
      else nav("/employee");
    } catch(err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4">Signup</h2>

        <select name="role" value={form.role} onChange={handleChange} className="w-full mb-2 p-2 border rounded">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-2 p-2 border rounded" required />
        {form.role === "employee" && (
          <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
