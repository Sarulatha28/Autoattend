import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/employees/${id}`)
      .then(res => setEmployee(res.data));
  }, [id]);

  if (!employee) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar always on top */}
      <Navbar />

      {/* ✅ Page content below navbar */}
      <div className="pt-20 px-6 flex flex-col lg:flex-row items-start gap-8">
        {/* Left Side Photo */}
        <div className="flex-shrink-0">
          <img
            src={`http://localhost:5000${employee.photo}`}
            alt={employee.name}
            className="w-40 h-40 rounded-full object-cover border"
          />
        </div>

        {/* Right Side Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white shadow p-6 rounded w-full">
          <div>
            <p className="font-semibold">Employee Name</p>
            <p className="bg-gray-200 px-3 py-1">{employee.name}</p>
          </div>
          <div>
            <p className="font-semibold">Email Id</p>
            <p className="bg-gray-200 px-3 py-1">{employee.email}</p>
          </div>
          <div>
            <p className="font-semibold">Employee Id</p>
            <p className="bg-gray-200 px-3 py-1">{employee.employeeId}</p>
          </div>
          <div>
            <p className="font-semibold">DOB</p>
            <p className="bg-gray-200 px-3 py-1">
              {new Date(employee.dob).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-semibold">Phone Number</p>
            <p className="bg-gray-200 px-3 py-1">{employee.phone || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Date of Joining</p>
            <p className="bg-gray-200 px-3 py-1">
              {new Date(employee.joiningDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-semibold">Role</p>
            <p className="bg-gray-200 px-3 py-1">{employee.role || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p className="bg-gray-200 px-3 py-1">{employee.status || "Active"}</p>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <p className="font-semibold">Address</p>
            <p className="bg-gray-200 px-3 py-1">{employee.address || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
