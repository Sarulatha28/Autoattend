import React, { useState } from "react";

const Stepper = ({ step }) => {
  const labels = ["Company", "Personal", "Documents", "Education"]; // Added Company step
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

export default function EmployeeSignupForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Company details
    companyName: "",
    companyEmail: "",
    companyPassword: "",

    // Personal details
    name: "",
    email: "",
    password: "",
    fatherName: "",
    motherName: "",
    phone: "",
    dob: "",
    gender: "Female",
    bio: "",
  });

  const [message, setMessage] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validateStep = () => {
    const missing = [];
    if (step === 1) {
      if (!form.companyName) missing.push("Company Name");
      if (!form.companyEmail) missing.push("Company Email");
      if (!form.companyPassword) missing.push("Company Password");
    } else if (step === 2) {
      if (!form.name) missing.push("Employee Name");
      if (!form.email) missing.push("Employee Email");
      if (!form.password) missing.push("Employee Password");
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

  return (
    <div>
      <Stepper step={step} />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-3">Employee Sign Up</h2>
        {message && <div className="mb-2 text-sm text-red-600">{message}</div>}

        <form className="space-y-4">
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
                name="companyEmail"
                value={form.companyEmail}
                onChange={onChange}
                placeholder="Company Email"
                className="w-full border p-2 rounded"
              />
              <input
                name="companyPassword"
                value={form.companyPassword}
                onChange={onChange}
                type="password"
                placeholder="Company Password"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {step === 2 && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Employee Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Employee Email"
                className="w-full border p-2 rounded"
              />
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                type="password"
                placeholder="Employee Password"
                className="w-full border p-2 rounded"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />
              <input
                name="dob"
                value={form.dob}
                onChange={onChange}
                type="date"
                placeholder="DOB"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {/* Step 3 - Documents (your Aadhaar, PAN, Bank Uploads go here) */}
          {/* Step 4 - Education (your education rows go here) */}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Back
              </button>
            )}
            {step < 4 ? (
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
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
