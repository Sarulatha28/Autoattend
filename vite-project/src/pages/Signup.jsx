import { useState } from "react";
import api from "../lib/api";

export default function Signup() {
  const [role, setRole] = useState("company"); // default company
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyPassword: "",
    employeeName: "",
    employeeEmail: "",
    employeePassword: "",
    employeePhone: "",
  });
  const [message, setMessage] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      let res;
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
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setRole("company")}
            className={`px-4 py-2 rounded-l ${role === "company" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Company
          </button>
          <button
            onClick={() => setRole("employee")}
            className={`px-4 py-2 rounded-r ${role === "employee" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Employee
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          {role === "company" ? (
            <>
              <input
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                placeholder="Company Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="companyEmail"
                value={form.companyEmail}
                onChange={onChange}
                placeholder="Company Email"
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                name="companyPassword"
                value={form.companyPassword}
                onChange={onChange}
                placeholder="Company Password"
                className="w-full border p-2 rounded"
              />
            </>
          ) : (
            <>
              <input
                name="employeeName"
                value={form.employeeName}
                onChange={onChange}
                placeholder="Employee Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="employeeEmail"
                value={form.employeeEmail}
                onChange={onChange}
                placeholder="Employee Email"
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                name="employeePassword"
                value={form.employeePassword}
                onChange={onChange}
                placeholder="Employee Password"
                className="w-full border p-2 rounded"
              />
              <input
                name="employeePhone"
                value={form.employeePhone}
                onChange={onChange}
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600">{message}</div>
        )}
      </div>
    </div>
  );
}
