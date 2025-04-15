import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'

// register user
export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Registered successfully!');
      navigate('/login');  // Redirect to login after successful registration
    } else {
      const errorMessage = await res.text();
      alert(`Registration failed: ${errorMessage}`);
    }
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
