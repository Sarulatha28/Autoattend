// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import api from "../services/api";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeList from "./EmployeeList";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { companyId } = useParams();
  const [attendanceList, setAttendanceList] = useState([]);
  const [events, setEvents] = useState([]);
  const [insideList, setInsideList] = useState({});

  // UI controls
  const [showForm, setShowForm] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit("join-company", companyId);

    // Listen for attendance updates
    socket.on("attendance_update", (data) => {
      setAttendanceList((prev) => [data, ...prev]);
    });

    // Listen for live events
    socket.on("attendance-event", (ev) => {
      setEvents((prev) => [ev, ...prev].slice(0, 200));
      setInsideList((prev) => {
        const copy = { ...prev };
        if (ev.type === "IN") {
          copy[ev.employeeId] = {
            name: ev.name,
            lastSeen: ev.timestamp,
            type: "IN",
          };
        } else {
          delete copy[ev.employeeId];
        }
        return copy;
      });
    });

    // Load initial company data (optional)
    (async () => {
      try {
        const res = await api.get(`/company/${companyId}`);
        if (res.data.insideList) setInsideList(res.data.insideList);
      } catch (err) {
        console.error("Failed to fetch company data", err);
      }
    })();

    return () => {
      socket.off("attendance_update");
      socket.off("attendance-event");
      socket.disconnect();
    };
  }, [companyId]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="pt-20 px-6">
        <h2 className="text-2xl font-bold mb-4">
          Admin Dashboard — {companyId}
        </h2>

        {/* Employee Management */}
        {showForm && <AddEmployeeForm onClose={() => setShowForm(false)} />}
        {showProfiles && <EmployeeList />}

        {/* Currently Inside Employees */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            Currently Inside ({Object.keys(insideList).length})
          </h3>
          <ul className="list-disc pl-6">
            {Object.entries(insideList).map(([id, e]) => (
              <li key={id}>
                {e.name} — in since {new Date(e.lastSeen).toLocaleTimeString()}
              </li>
            ))}
            {Object.keys(insideList).length === 0 && (
              <li>No one inside right now</li>
            )}
          </ul>
        </section>

        {/* Live Attendance List */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Attendance Updates</h3>
          <ul className="list-disc pl-6">
            {attendanceList.map((att, index) => (
              <li key={index}>
                {att.employeeName} marked {att.type} at{" "}
                {new Date(att.time).toLocaleTimeString()}
              </li>
            ))}
            {attendanceList.length === 0 && <li>No attendance updates yet</li>}
          </ul>
        </section>

        {/* Live Events */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Live Events</h3>
          <ul className="list-disc pl-6">
            {events.map((ev, i) => (
              <li key={i}>
                {new Date(ev.timestamp).toLocaleTimeString()} — {ev.name} — {ev.type}
              </li>
            ))}
            {events.length === 0 && <li>No live events yet</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
