import React from "react";
import Navbar from "../components/Navbar";

const Notification = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar fixed on top */}
      <Navbar />

      {/* ✅ Page content below navbar */}
      <div className="pt-20 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Notifications
        </h1>

        {/* Example notification list */}
        <div className="space-y-3">
          <div className="p-4 bg-white shadow rounded">📢 New employee added</div>
          <div className="p-4 bg-white shadow rounded">✅ Attendance marked</div>
          <div className="p-4 bg-white shadow rounded">⚠️ Server downtime alert</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
