import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/employees")
      .then(res => setEmployees(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar always on top */}
      <Navbar />

      {/* ✅ Page content below navbar */}
      <div className="pt-20 px-6 h-[calc(100vh-80px)] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Employee Profiles</h2>
        <div className="space-y-4">
          {employees.map((emp) => (
            <div
              key={emp._id}
              onClick={() => navigate(`/employees/${emp._id}`)}
              className="flex items-center bg-white shadow p-4 rounded cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={`http://localhost:5000${emp.photo}`}
                alt={emp.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-lg font-semibold">{emp.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
