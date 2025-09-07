// src/pages/EmployeeHome.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function EmployeeHome({ onLogout }){
  const [status, setStatus] = useState('Initializing...');
  const [inside, setInside] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    let watchId = null;
    if (!('geolocation' in navigator)) {
      setStatus('Geolocation not available in this browser.');
      return;
    }

    // Request permission first (for better UX in some browsers)
    navigator.permissions?.query({ name: 'geolocation' }).then(() => {});

    // Start watchPosition
    watchId = navigator.geolocation.watchPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try {
        const res = await api.post('/location/update', { lat, lon });
        setInside(res.data.inside);
        setDistance(Math.round(res.data.distanceMeters));
        setStatus('Location sent at ' + new Date().toLocaleTimeString());
      } catch (err) {
        setStatus('Error sending location');
      }
    }, (err) => {
      setStatus('GPS error: ' + err.message);
    }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 });

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Attendance (Auto)</h2>
      <p>{status}</p>
      <p>Inside geofence: <strong>{inside ? 'Yes' : 'No'}</strong></p>
      {distance !== null && <p>Distance from center: {distance} m</p>}
      <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('employee'); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
}
