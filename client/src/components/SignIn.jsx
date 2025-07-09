import React, { useState } from 'react';
import axios from "axios";

const SignIn = ({ onSignIn }) => {
  const [form, setForm] = useState({ email: '', password: '', userName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("http://localhost:8080/auth/signin", form, {
      withCredential: true,
    })
    localStorage.setItem("token", response.data.token);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <input
        type="text"
        placeholder="UserName"
        className="w-full p-2 border mb-4 text-black"
        value={form.userName}
        onChange={(e) => setForm({ ...form, userName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-4"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-4"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
};

export default SignIn;
