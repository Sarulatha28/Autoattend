// EmployeeAttendanceButton.jsx
import React, { useState } from "react";
import axios from "axios";

export default function EmployeeAttendanceButton({ companyId, employeeId }) {
  const [status, setStatus] = useState("");

  const mark = async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      try {
        const res = await axios.post("/api/attendance/check", { companyId, employeeId, lat, lng });
        setStatus(res.data.status);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }, (err) => alert("Allow location permission to mark attendance"));
  };

  return (
    <div>
      <button onClick={mark} className="bg-blue-600 text-white px-4 py-2 rounded">
        Mark Attendance
      </button>
      <div>{status}</div>
    </div>
  );
}
