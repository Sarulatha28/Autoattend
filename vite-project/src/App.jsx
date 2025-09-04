import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeMonthly from "./pages/EmployeeMonthly";

const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/signin" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/admin" element={<RequireAuth role="office"><AdminDashboard/></RequireAuth>} />
        <Route path="/employee" element={<RequireAuth role="employee"><EmployeeDashboard/></RequireAuth>} />
        <Route path="/employee/:id/monthly" element={<RequireAuth role="office"><EmployeeMonthly/></RequireAuth>} />
      </Routes>
    </div>
  );
}
