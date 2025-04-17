import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth";
import '../styles/Login.css';

interface FormState {
  email: string;
  password: string;
}

// login screen
export default function Login() {
  const { auth } = useAuth();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        await auth.loginUser(form.email, form.password);
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            alert('Your account is disabled. Please contact support.');
        } else {
            alert('Invalid email or password.');
        }
    }
};

  return (
    <div className="login-page">
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
          <Button type="submit" variant="primary" size="lg" className="login-buttons w-100 mt-4">
            Login
          </Button>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="login-links">
            <Link className="link" to="/register">No Account? Register</Link>
            <Link className="link" to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
