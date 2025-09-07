import React, { useState } from "react";
import { Bell, Plus, User, Menu, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/attendo logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 w-full flex justify-between items-center px-6 py-3 bg-white shadow-md z-50">
      
      {/* Left: Logo + Title (click → Home) */}
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/admin")}
      >
        <img
          src={img1}
          alt="Attendo Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
        />
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Attendo
        </span>
      </div>

      {/* Right: Desktop Icons */}
      <div className="hidden md:flex items-center space-x-6">
        <Home
          className="w-6 h-6 text-gray-700 cursor-pointer hover:text-indigo-500 transition"
          onClick={() => navigate("/admin")}
        />
        <Bell
          className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition"
          onClick={() => navigate("/notifications")}
        />
        <Plus
          className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-500 transition"
          onClick={() => navigate("/add-employee")}
        />
        <User
          className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-500 transition"
          onClick={() => navigate("/employees")}
        />
      </div>

      {/* Right: Mobile Hamburger */}
      <div className="md:hidden">
        {menuOpen ? (
          <X
            className="w-7 h-7 text-gray-700 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <Menu
            className="w-7 h-7 text-gray-700 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 flex flex-col space-y-4 z-40">
          <Home
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-indigo-500"
            onClick={() => { setMenuOpen(false); navigate("/admin"); }}
          />
          <Bell
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500"
            onClick={() => { setMenuOpen(false); navigate("/notifications"); }}
          />
          <Plus
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-500"
            onClick={() => { setMenuOpen(false); navigate("/add-employee"); }}
          />
          <User
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-purple-500"
            onClick={() => { setMenuOpen(false); navigate("/employees"); }}
          />
        </div>
      )}
    </nav>
  );
}
