import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/signin", form);

      // Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // If office/admin, save company details too
      if (data.user.role === "office" && data.company) {
        localStorage.setItem("company", JSON.stringify(data.company));
        nav("/admin/dashboard");
      } else {
        nav("/employee/dashboard");
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>

      {message && <div className="mb-2 text-red-600">{message}</div>}

      <form onSubmit={submit} className="space-y-4">
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          type="password"
          className="w-full border p-2 rounded"
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}
