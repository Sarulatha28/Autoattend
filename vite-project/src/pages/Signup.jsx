import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signup(){
  const nav = useNavigate();
  const [form,setForm] = useState({ name:"", email:"", password:"", role:"employee", latitude:"", longitude:"", radiusMeters:100 });

  const onChange = e => setForm(f=>({...f, [e.target.name]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    const body = {...form};
    if (form.role !== "office") {
      delete body.latitude; delete body.longitude; delete body.radiusMeters;
    } else {
      body.latitude = parseFloat(form.latitude);
      body.longitude = parseFloat(form.longitude);
      body.radiusMeters = parseInt(form.radiusMeters || 100, 10);
    }
    await api.post("/auth/signup", body);
    alert("Registered. Please Sign In.");
    nav("/signin");
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-12 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label>Role</label>
          <select name="role" value={form.role} onChange={onChange} className="w-full border p-2 rounded">
            <option value="employee">Employee</option>
            <option value="office">Office/Admin</option>
          </select>
        </div>
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="w-full border p-2 rounded" required />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full border p-2 rounded" required />
        <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="w-full border p-2 rounded" required />
        {form.role === "office" && (
          <div className="grid grid-cols-3 gap-2">
            <input name="latitude" value={form.latitude} onChange={onChange} placeholder="Latitude" className="border p-2 rounded" required />
            <input name="longitude" value={form.longitude} onChange={onChange} placeholder="Longitude" className="border p-2 rounded" required />
            <input name="radiusMeters" value={form.radiusMeters} onChange={onChange} placeholder="Radius (m)" className="border p-2 rounded" />
          </div>
        )}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
