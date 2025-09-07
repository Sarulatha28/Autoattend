import React, { useState } from "react";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeList from "./EmployeeList";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content (add padding so content is not hidden behind navbar) */}
      <div className="pt-20 px-6">
        {showForm && <AddEmployeeForm onClose={() => setShowForm(false)} />}
        {showProfiles && <EmployeeList />}
      </div>
    </div>
  );
}
