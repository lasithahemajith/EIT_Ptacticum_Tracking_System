import { useState } from "react";
import API from "@/api/axios";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/users", form);
      setMessage("✅ User created successfully!");
      setForm({ name: "", email: "", password: "", role: "Student" });
    } catch {
      setMessage("❌ Failed to create user.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">Create New User</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <select name="role" value={form.role} onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>Student</option>
          <option>Mentor</option>
          <option>Tutor</option>
        </select>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full">
          Create
        </button>
      </form>
      {message && <p className="mt-3 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
