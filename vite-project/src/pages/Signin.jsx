import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [role, setRole] = useState("company");
  const [form, setForm] = useState({
    companyName: "", companyEmail: "", companyPassword: "",
    employeeName: "", employeeEmail: "", employeePassword: "", employeePhone: "",
    signinEmail: "", signinPassword: "",
  });
  const [message, setMessage] = useState("");

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mode === "signup") {
        if (role === "company") {
          res = await api.post("/auth/company/signup", {
            companyName: form.companyName,
            companyEmail: form.companyEmail,
            companyPassword: form.companyPassword,
          });
        } else {
          res = await api.post("/auth/employee/signup", {
            employeeName: form.employeeName,
            employeeEmail: form.employeeEmail,
            employeePassword: form.employeePassword,
            employeePhone: form.employeePhone,
          });
        }
        setMessage(res.data.message);
        // Redirect after signup
        if (res.data.role === "admin") navigate("/admin-dashboard");
        if (res.data.role === "employee") navigate("/employee-dashboard");
      } else {
        res = await api.post("/auth/signin", {
          email: form.signinEmail,
          password: form.signinPassword,
        });
        setMessage(res.data.message);
        if (res.data.role === "admin") navigate("/admin-dashboard");
        if (res.data.role === "employee") navigate("/employee-dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">{mode === "signup" ? "Signup" : "Signin"}</h2>
        <div className="flex justify-center mb-4">
          <button onClick={() => setMode("signup")} className={`px-4 py-2 rounded-l ${mode === "signup" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Signup</button>
          <button onClick={() => setMode("signin")} className={`px-4 py-2 rounded-r ${mode === "signin" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Signin</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" ? (
            <>
              <div className="flex justify-center mb-2">
                <button type="button" onClick={() => setRole("company")} className={`px-4 py-1 rounded-l ${role === "company" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Company</button>
                <button type="button" onClick={() => setRole("employee")} className={`px-4 py-1 rounded-r ${role === "employee" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Employee</button>
              </div>
              {role === "company" && <>
                <input name="companyName" value={form.companyName} onChange={onChange} placeholder="Company Name" className="w-full border p-2 rounded"/>
                <input name="companyEmail" value={form.companyEmail} onChange={onChange} placeholder="Company Email" className="w-full border p-2 rounded"/>
                <input type="password" name="companyPassword" value={form.companyPassword} onChange={onChange} placeholder="Password" className="w-full border p-2 rounded"/>
              </>}
              {role === "employee" && <>
                <input name="employeeName" value={form.employeeName} onChange={onChange} placeholder="Employee Name" className="w-full border p-2 rounded"/>
                <input name="employeeEmail" value={form.employeeEmail} onChange={onChange} placeholder="Employee Email" className="w-full border p-2 rounded"/>
                <input type="password" name="employeePassword" value={form.employeePassword} onChange={onChange} placeholder="Password" className="w-full border p-2 rounded"/>
                <input name="employeePhone" value={form.employeePhone} onChange={onChange} placeholder="Phone Number" className="w-full border p-2 rounded"/>
              </>}
            </>
          ) : (
            <>
              <input name="signinEmail" value={form.signinEmail} onChange={onChange} placeholder="Email" className="w-full border p-2 rounded"/>
              <input type="password" name="signinPassword" value={form.signinPassword} onChange={onChange} placeholder="Password" className="w-full border p-2 rounded"/>
            </>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{mode === "signup" ? "Register" : "Login"}</button>
        </form>
        {message && <div className="mt-4 text-center text-sm text-green-600">{message}</div>}
      </div>
    </div>
  );
}
