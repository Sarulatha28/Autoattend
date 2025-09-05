import React, { useEffect, useState } from "react";

const Stepper = ({ step }) => {
  const labels = ["Company", "Location"]; // 🔹 Removed Payment step
  return (
    <div className="flex justify-between items-center mb-6 relative">
      {labels.map((label, i) => (
        <div key={i} className="relative flex-1 text-center">
          {i !== 0 && (
            <div className="absolute top-4 -left-1/2 w-full -z-10">
              <div className="h-0.5 bg-gray-300 w-full">
                <div
                  className={`h-0.5 transition-all duration-500 ${
                    step > i ? "bg-blue-600 w-full" : "bg-blue-600 w-0"
                  }`}
                />
              </div>
            </div>
          )}
          <div
            className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-white z-10 ${
              step >= i + 1 ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </div>
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
  );
};

export default function AdminSignupForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
    radiusMeters: 100,
    startTime: "09:00",
    endTime: "17:00",
    lateAfter: 15,
    weeklyOff: "Sunday",
  });
  const [companyFiles, setCompanyFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [otpValue, setOtpValue] = useState("");

  useEffect(() => {
    if (step === 2 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        },
        () => {}
      );
    }
  }, [step]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFiles = (e) => setCompanyFiles(Array.from(e.target.files));

  const validateStep = () => {
    const missing = [];
    if (step === 1) {
      if (!form.companyName) missing.push("Company Name");
      if (!form.companyAddress) missing.push("Company Address");
      if (!form.email) missing.push("Admin Email");
      if (!form.password) missing.push("Password");
      if (companyFiles.length === 0) missing.push("Company documents (required)");
    } else if (step === 2) {
      if (!form.latitude || !form.longitude)
        missing.push("Latitude / Longitude");
    }
    if (missing.length) {
      setMessage("Please provide: " + missing.join(", "));
      return false;
    }
    setMessage("");
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const submit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      const payload = new FormData();
      Object.keys(form).forEach((k) => payload.append(k, form[k]));
      payload.append("role", "office");
      companyFiles.forEach((f) => payload.append("companyDocs", f));

      const res = await fetch(
        (process.env.REACT_APP_API_URL || "http://localhost:5000") +
          "/auth/signup-init",
        {
          method: "POST",
          body: payload,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup init failed");

      setOtpId(data.otpId);
      setOtpValue("");
      setOtpStage(true);
      setMessage(
        `OTP sent (demo): ${data.otp}. Enter OTP to finish registration.`
      );
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const verifyOtp = async () => {
    if (!otpId || !otpValue) {
      setMessage("Enter OTP");
      return;
    }
    try {
      const res = await fetch(
        (process.env.REACT_APP_API_URL || "http://localhost:5000") +
          "/auth/signup-verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otpId, otp: otpValue }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verify failed");
      setMessage("✅ Signup complete. Please sign in.");
      setTimeout(() => (window.location.href = "/signin"), 1400);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div>
      <Stepper step={step} />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-3">Admin Sign Up</h2>
        {message && <div className="mb-2 text-sm">{message}</div>}

        {!otpStage ? (
          <form onSubmit={submit} className="space-y-4">
            {step === 1 && (
              <>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                  placeholder="Company Name"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="companyAddress"
                  value={form.companyAddress}
                  onChange={onChange}
                  placeholder="Company Address"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Admin Email"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Password"
                  type="password"
                  className="w-full border p-2 rounded"
                />
                <label className="text-sm">
                  Upload Company Documents (GST/Registration/PAN) *
                </label>
                <input type="file" multiple onChange={onFiles} />
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-gray-600">
                  Auto-detected location (you can edit)
                </p>
                <input
                  name="latitude"
                  value={form.latitude}
                  onChange={onChange}
                  placeholder="Latitude"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="longitude"
                  value={form.longitude}
                  onChange={onChange}
                  placeholder="Longitude"
                  className="w-full border p-2 rounded"
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

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="p-4 border rounded">
            <p className="mb-2">
              Enter OTP sent to your email/phone (demo OTP is shown earlier).
            </p>
            <input
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              placeholder="OTP"
              className="w-full border p-2 rounded mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={verifyOtp}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Verify & Complete
              </button>
              <button
                onClick={() => {
                  setOtpStage(false);
                  setMessage("");
                }}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
