import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth";
import '../styles/Login.css'

// register user
export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.registerUser(
      form.username,
      form.email,
      form.password,
    );
    // No need to navigate manually; context handles redirection
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/login')}
        >
          Have an Account? Login
        </button>
      </div>
    </form>
  );
}
