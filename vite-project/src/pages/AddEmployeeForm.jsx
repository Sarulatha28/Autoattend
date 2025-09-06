import React, { useState } from "react";
import axios from "axios";

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
    <div className="p-6 bg-white shadow rounded w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" onChange={handleChange} placeholder="Name" className="border p-2 w-full" />
        <input name="email" onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
        <input name="employeeId" onChange={handleChange} placeholder="Employee ID" className="border p-2 w-full" />
        <input name="companyId" onChange={handleChange} placeholder="Company ID" className="border p-2 w-full" />
        <input name="age" onChange={handleChange} placeholder="Age" className="border p-2 w-full" />
        <select name="gender" onChange={handleChange} className="border p-2 w-full">
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input type="date" name="dob" onChange={handleChange} className="border p-2 w-full" />
        <input type="date" name="joiningDate" onChange={handleChange} className="border p-2 w-full" />
        <input name="aadhaar" onChange={handleChange} placeholder="Aadhaar" className="border p-2 w-full" />
        <input name="bankAccNum" onChange={handleChange} placeholder="Bank Account No" className="border p-2 w-full" />
        <input name="ifscCode" onChange={handleChange} placeholder="IFSC Code" className="border p-2 w-full" />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Employee</button>
      </form>
    </div>
  );
}
