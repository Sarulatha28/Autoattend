import { Link } from "react-router-dom";
export default function Landing(){
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="p-8 rounded-lg shadow max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">AutoAttend</h1>
        <p className="text-gray-600 mb-6">Automatic attendance with geofencing</p>
        <div className="flex justify-center gap-4">
          <Link to="/signin" className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</Link>
          <Link to="/signup" className="px-4 py-2 bg-gray-800 text-white rounded">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
