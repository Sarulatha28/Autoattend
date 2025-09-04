import { useEffect, useState } from "react";
import api from "../lib/api";

export default function EmployeeDashboard(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [status,setStatus] = useState("");
  const [coords,setCoords] = useState(null);
  const [leave,setLeave] = useState({ fromDate:"", toDate:"", reason:"" });

  useEffect(() => {
    if (!user) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        try {
          // send lat/lng; backend gets user id from token
          const { data } = await api.post("/attendance/mark", { latitude, longitude });
          setStatus(data.status + (data.already ? " (already)" : ""));
        } catch (e) {
          setStatus("Failed to mark");
        }
      }, () => setStatus("Location permission denied"));
    } else setStatus("Geolocation not supported");
  }, []);

  const submitLeave = async e => {
    e.preventDefault();
    await api.post("/leaves/apply", leave);
    alert("Leave applied");
    setLeave({ fromDate:"", toDate:"", reason:"" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
        <p className="mt-2">Attendance Status: <span className={status.includes("Present") ? "text-green-600" : "text-red-600"}>{status || "Marking..."}</span></p>
        {coords && <p className="text-sm text-gray-500 mt-2">Lat: {coords.latitude.toFixed(4)}, Lng: {coords.longitude.toFixed(4)}</p>}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-bold mb-3">Apply Leave</h3>
        <form onSubmit={submitLeave} className="grid sm:grid-cols-3 gap-3">
          <input type="date" value={leave.fromDate} onChange={e=>setLeave(l=>({...l,fromDate:e.target.value}))} className="border p-2 rounded" required />
          <input type="date" value={leave.toDate} onChange={e=>setLeave(l=>({...l,toDate:e.target.value}))} className="border p-2 rounded" required />
          <textarea value={leave.reason} onChange={e=>setLeave(l=>({...l,reason:e.target.value}))} className="border p-2 rounded sm:col-span-3" placeholder="Reason" />
          <div className="sm:col-span-3"><button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button></div>
        </form>
      </div>
    </div>
  );
}
