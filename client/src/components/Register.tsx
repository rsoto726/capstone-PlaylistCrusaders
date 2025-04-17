import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../auth";
import { Button } from 'react-bootstrap';
import '../styles/Login.css';

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
    <div className='login-page'>
      <div className="login-container">
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
            className='mt-3'
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className='mt-3'
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="primary" size="lg" className="login-buttons w-100 mt-3">
            Register
          </Button>
          <div className="login-links mt-3 text-center">
            <Link className="link" to="/login">Have an Account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
