// src/pages/AdminGeofence.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon path in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ClickMarker({ position, setPosition }){
  useMapEvents({
    click(e){ setPosition([e.latlng.lat, e.latlng.lng]); }
  });
  return position ? <Marker position={position} /> : null;
}

export default function AdminGeofence() {
  const { companyId } = useParams();
  const [position, setPosition] = useState([13.0827,80.2707]); // default
  const [radius, setRadius] = useState(50);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function load() {
      if (!companyId) return;
      try {
        const res = await api.get(`/company/${companyId}`);
        setCompany(res.data);
        if (res.data.geofence?.center?.coordinates) {
          const c = res.data.geofence.center.coordinates;
          setPosition([c[1], c[0]]);
        }
        if (res.data.geofence?.radiusMeters) setRadius(res.data.geofence.radiusMeters);
      } catch (err) {
        // not found or server error
      }
    }
    load();
  }, [companyId]);

  const save = async () => {
    try {
      await api.post('/company/create', {
        name: company?.name || companyId,
        companyId,
        latitude: position[0],
        longitude: position[1],
        radiusMeters: Number(radius)
      });
      alert('Saved geofence');
    } catch (err) {
      alert('Save failed');
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h3>Geofence for {companyId}</h3>
      <div style={{ maxWidth: 900 }}>
        <MapContainer center={position} zoom={16} style={{ height: 400 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickMarker position={position} setPosition={setPosition} />
          <Circle center={position} radius={radius} />
        </MapContainer>
        <div style={{ marginTop: 6 }}>
          <label>Latitude: <input value={position[0]} onChange={e => setPosition([parseFloat(e.target.value || 0), position[1]])} /></label>
          <label>Longitude: <input value={position[1]} onChange={e => setPosition([position[0], parseFloat(e.target.value || 0)])} /></label>
          <label>Radius (meters): <input type="number" value={radius} onChange={e=>setRadius(e.target.value)} /></label>
          <button onClick={save}>Save Geofence</button>
        </div>
      </div>
    </div>
  );
}
