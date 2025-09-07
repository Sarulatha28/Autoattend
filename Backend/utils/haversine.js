// backend/utils/haversine.js
export function toRad(deg){ return deg * Math.PI / 180; }

export function haversineDistanceMeters(lat1, lon1, lat2, lon2){
  const R = 6371000; // meters
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // meters
}
