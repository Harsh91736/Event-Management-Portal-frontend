import React, { useState } from "react";
import axios from "axios";

const roles = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "headFaculty", label: "Head Faculty" },
];

function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation
    if (
      !form.fullName ||
      !form.email ||
      !form.contactNumber ||
      !form.password ||
      !form.role
    ) {
      setError(
        "All required fields (Full Name, Email, Contact Number, Password, Role) are necessary."
      );
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        form
      );
      if (res.data.success) {
        setSuccess("Registration successful! You can now login.");
        setForm({
          fullName: "",
          email: "",
          contactNumber: "",
          password: "",
          role: "",
        });
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Server error. Please try again later."
      );
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && (
        <div className="mb-2 text-red-600 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="mb-2 text-green-600 text-sm text-center">{success}</div>
      )}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Contact Number *</label>
        <input
          type="text"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Password *</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Role *</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;