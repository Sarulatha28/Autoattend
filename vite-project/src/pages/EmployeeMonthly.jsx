import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";

export default function EmployeeMonthly(){
  const { id } = useParams();
  const [params] = useSearchParams();
  const [data,setData] = useState(null);

  const load = async () => {
    const month = params.get("month");
    const { data } = await api.get(`/attendance/monthly/${id}${month ? `?month=${month}` : ""}`);
    setData(data);
  };

  useEffect(()=>{ load(); }, [id, params]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly: {data.month}</h2>
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Stat label="Present" value={data.presentCount} />
        <Stat label="Not Marked" value={data.notMarkedCount} />
        <Stat label="Inside Office Days" value={data.insideDays} />
        <Stat label="Outside Days" value={data.outsideDays} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-3">Daily Records</h3>
        <ul className="divide-y">
          {data.records.map(r => (
            <li key={r._id} className="py-2 flex justify-between">
              <span>{new Date(r.timestamp).toLocaleDateString()} — {new Date(r.timestamp).toLocaleTimeString()}</span>
              <span className={r.status === "Present" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{r.status} {r.insideOffice ? "(Inside)" : "(Outside)"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
