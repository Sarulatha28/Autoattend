import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function AdminDashboard(){
  const nav = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [today, setToday] = useState({ present:[], absent:[] });
  const [empForm, setEmpForm] = useState({ name:"", email:"", password:"" });
  const [office, setOffice] = useState({ latitude:"", longitude:"", radiusMeters:100 });
  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    const emps = await api.get("/users/employees"); setEmployees(emps.data);
    const tod = await api.get("/attendance/today"); setToday(tod.data);
    const me = await api.get("/users/me");
    if (me.data?.officeLocation) setOffice({...me.data.officeLocation});
    const lvs = await api.get("/leaves/admin"); setLeaves(lvs.data);
  };

  useEffect(()=>{ load(); }, []);

  const addEmployee = async e=>{
    e.preventDefault();
    await api.post("/users/add-employee", empForm);
    setEmpForm({ name:"", email:"", password:"" });
    await load();
  };

  const saveOffice = async e=>{
    e.preventDefault();
    await api.patch("/users/office/location", { latitude: parseFloat(office.latitude), longitude: parseFloat(office.longitude), radiusMeters: parseInt(office.radiusMeters||100,10) });
    alert("Saved");
    await load();
  };

  const actLeave = async (id, action) => {
    await api.patch(`/leaves/${id}/${action}`);
    await load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="bg-white p-6 rounded mb-6 shadow">
        <h3 className="font-bold mb-3">Set Office Location</h3>
        <form onSubmit={saveOffice} className="grid sm:grid-cols-3 gap-3">
          <input value={office.latitude||""} onChange={e=>setOffice(o=>({...o,latitude:e.target.value}))} placeholder="Latitude" className="border p-2 rounded" required/>
          <input value={office.longitude||""} onChange={e=>setOffice(o=>({...o,longitude:e.target.value}))} placeholder="Longitude" className="border p-2 rounded" required/>
          <input value={office.radiusMeters||100} onChange={e=>setOffice(o=>({...o,radiusMeters:e.target.value}))} placeholder="Radius (m)" className="border p-2 rounded" />
          <div className="sm:col-span-3"><button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button></div>
        </form>
      </div>

      <div className="bg-white p-6 rounded mb-6 shadow">
        <h3 className="font-bold mb-3">Add Employee</h3>
        <form onSubmit={addEmployee} className="grid sm:grid-cols-3 gap-3">
          <input value={empForm.name} onChange={e=>setEmpForm(f=>({...f,name:e.target.value}))} placeholder="Name" className="border p-2 rounded" required/>
          <input value={empForm.email} onChange={e=>setEmpForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="border p-2 rounded" required/>
          <input value={empForm.password} onChange={e=>setEmpForm(f=>({...f,password:e.target.value}))} placeholder="Password" className="border p-2 rounded" required/>
          <div className="sm:col-span-3"><button className="bg-green-600 text-white px-4 py-2 rounded">Add</button></div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-3">Present Today</h3>
          <ul className="divide-y">
            {today.present.map(e => (
              <li key={e._id} className="py-2 flex justify-between">
                <span>{e.name} <small className="text-gray-500">({e.email})</small></span>
                <button className="text-blue-600" onClick={()=>nav(`/employee/${e._id}/monthly`)}>Monthly</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-3">Absent Today</h3>
          <ul className="divide-y">
            {today.absent.map(e => (
              <li key={e._id} className="py-2 flex justify-between">
                <span>{e.name} <small className="text-gray-500">({e.email})</small></span>
                <button className="text-blue-600" onClick={()=>nav(`/employee/${e._id}/monthly`)}>Monthly</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-bold mb-3">Leave Requests</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th>Employee</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {leaves.map(l=>(
              <tr key={l._id} className="border-b">
                <td className="py-2">{l.employeeName}</td>
                <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                <td>{new Date(l.toDate).toLocaleDateString()}</td>
                <td>{l.reason}</td>
                <td className="font-semibold">{l.status}</td>
                <td className="space-x-2">
                  <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={()=>actLeave(l._id,"approve")}>Approve</button>
                  <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>actLeave(l._id,"reject")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
