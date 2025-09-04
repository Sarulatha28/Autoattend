import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceTable() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          console.log("📍 Current Location:", latitude, longitude);

          // Send to backend to mark attendance
          try {
            const res = await axios.post("http://localhost:5000/api/attendance/mark", {
              employeeName: "Saranya.M",  // You can change this dynamically
              latitude,
              longitude,
            });

            setStatus(res.data.status);
          } catch (err) {
            console.error("❌ Error:", err);
          }
        },
        (error) => {
          console.error("❌ Location error:", error);
        }
      );
    } else {
      console.error("❌ Geolocation not available");
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Attendance Status</h2>
      <p className={`text-lg font-semibold ${status === "Checked In" ? "text-green-600" : "text-red-600"}`}>
        {status ? status : "Fetching location..."}
      </p>
    </div>
  );
}
