import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signin(){
  const nav = useNavigate();
  const [form,setForm] = useState({ email:"", password:"" });
  const onChange = e => setForm(f=>({...f, [e.target.name]: e.target.value}));

  const submit = async e => {
    e.preventDefault();
    const { data } = await api.post("/auth/signin", form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.user.role === "office") nav("/admin"); else nav("/employee");
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <form onSubmit={submit} className="space-y-4">
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full border p-2 rounded" required />
        <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="w-full border p-2 rounded" required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Sign In</button>
      </form>
    </div>
  );
}
