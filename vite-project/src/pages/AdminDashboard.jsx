import React, { useState } from "react";
import { Bell, Plus, User } from "lucide-react";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeList from "./EmployeeList";
import { useNavigate } from "react-router-dom";
import img1 from  "../assets/autoicon.jpg"

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 right-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-2">
          <img
  src={img1} // <-- replace with your logo path
  alt="Attendo Logo"
  className="w-10 h-10 rounded-full object-cover"
/>

          <span className="text-xl font-bold text-gray-800">Attendo</span>
        </div>

        {/* Right: Icons */}
        <div className="flex space-x-4">
          <Bell
            className="cursor-pointer"
            onClick={() => navigate("/notifications")}
          />
          <Plus
            className="cursor-pointer"
            onClick={() => navigate("/add-employee")}
          />
          <User
            className="cursor-pointer"
            onClick={() => navigate("/employees")}
          />
        </div>
      </div>

      {/* Page Content (with top padding so content is not hidden behind fixed bar) */}
      <div className="pt-16 p-6">
        {showForm && <AddEmployeeForm onClose={() => setShowForm(false)} />}
        {showProfiles && <EmployeeList />}
      </div>
    </div>
  );
}
