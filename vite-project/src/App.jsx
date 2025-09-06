import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Notification from "./pages/Notification";
import AddEmployee from "./pages/AddEmployeeForm";
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import AddEmployeeForm from "./pages/AddEmployeeForm";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100"></div>
      <Routes>
        <Route path="/" element={<Landing />} />   {/* Landing page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/notifications" element={<Notification />} />
          <Route path="/add-employee" element={<AddEmployeeForm />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;




