import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth";
import '../styles/Login.css'
interface FormState {
  email: string;
  password: string;
}

// login screen
export default function Login() {
  const { auth } = useAuth();

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await auth.loginUser(form.email, form.password);
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-container"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/register')}
          >
            No Account? Register
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>

  );
}