import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AddEmployeeForm({ onClose }) {
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("photo", photo);

    await axios.post("http://localhost:5000/api/employees/add", data);
    alert("Employee added!");
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar stays fixed on top */}
      <Navbar />

      {/* ✅ Page content below navbar */}
      <div className="pt-20 flex justify-center px-4">
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add Employee
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full rounded"
            />
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 w-full rounded"
            />
            <input
              name="employeeId"
              onChange={handleChange}
              placeholder="Employee ID"
              className="border p-2 w-full rounded"
            />
            <input
              name="companyId"
              onChange={handleChange}
              placeholder="Company ID"
              className="border p-2 w-full rounded"
            />
            <input
              name="age"
              onChange={handleChange}
              placeholder="Age"
              className="border p-2 w-full rounded"
            />
            <select
              name="gender"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="date"
              name="joiningDate"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              name="aadhaar"
              onChange={handleChange}
              placeholder="Aadhaar"
              className="border p-2 w-full rounded"
            />
            <input
              name="bankAccNum"
              onChange={handleChange}
              placeholder="Bank Account No"
              className="border p-2 w-full rounded"
            />
            <input
              name="ifscCode"
              onChange={handleChange}
              placeholder="IFSC Code"
              className="border p-2 w-full rounded"
            />
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="border p-2 w-full rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
