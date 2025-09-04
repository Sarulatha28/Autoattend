import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function AdminSignup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    companyName: "",
    address: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
    radiusMeters: 100,
    startTime: "09:00",
    endTime: "17:00",
    lateAfter: 15,
    weeklyOff: "Sunday"
  });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");

  // Generate captcha
  useEffect(() => {
    const random = Math.random().toString(36).substring(2, 8);
    setCaptcha(random);
  }, []);

  // Auto set geolocation
  useEffect(() => {
    if (step === 2 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
      });
    }
  }, [step]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (captcha !== captchaInput) {
      setMessage("❌ Captcha is incorrect!");
      return;
    }
    try {
      await api.post("/auth/admin-signup", form);
      setMessage("✅ Admin registered successfully!");
      setTimeout(() => nav("/signin"), 2000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 relative">
  {["Company", "Location", "Attendance"].map((label, i) => (
    <div key={i} className="relative flex-1 text-center">
      {/* line between steps (placed only between current and previous circle) */}
      {i !== 0 && (
        <div className="absolute top-4 -left-1/2 w-full -z-10 flex">
          <div className="h-0.5 w-full bg-gray-300">
            <div
              className={`h-0.5 transition-all duration-500 ${
                step > i ? "bg-blue-600 w-full" : "bg-blue-600 w-0"
              }`}
            />
          </div>
        </div>
      )}

      {/* circle */}
      <div
        className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-white z-10 ${
          step >= i + 1 ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        {i + 1}
      </div>

      {/* label */}
      <p
        className={`mt-1 text-sm ${
          step >= i + 1 ? "text-blue-600 font-semibold" : "text-gray-400"
        }`}
      >
        {label}
      </p>
    </div>
  ))}
</div>

    <div className="max-w-xl mx-auto p-6 mt-12 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Sign Up</h2>

      {message && <div className="mb-2 text-red-600">{message}</div>}

      <form onSubmit={submit} className="space-y-4">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="address"
              placeholder="Company Address"
              value={form.address}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex items-center space-x-2">
              <span className="bg-gray-200 px-2 rounded">{captcha}</span>
              <input
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="flex-1 border p-2 rounded"
                required
              />
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <p className="text-sm text-gray-600">
              📍 Location auto-detected. You can adjust if needed.
            </p>
            <input
              name="latitude"
              value={form.latitude}
              onChange={onChange}
              placeholder="Latitude"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="longitude"
              value={form.longitude}
              onChange={onChange}
              placeholder="Longitude"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="radiusMeters"
              value={form.radiusMeters}
              onChange={onChange}
              placeholder="Radius (m)"
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <label>Office Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
            <label>Office End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
            <label>Late After (minutes)</label>
            <input
              type="number"
              name="lateAfter"
              value={form.lateAfter}
              onChange={onChange}
              className="w-full border p-2 rounded"
            />
            <label>Weekly Off</label>
            <select
              name="weeklyOff"
              value={form.weeklyOff}
              onChange={onChange}
              className="w-full border p-2 rounded"
            >
              <option>Sunday</option>
              <option>Saturday</option>
              <option>Friday</option>
            </select>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          )}
        </div>
      </form>
    </div>
    </div>
  );
}
