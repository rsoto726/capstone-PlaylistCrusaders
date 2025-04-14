import React, {useState, ChangeEvent, FormEvent} from "react";
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'
interface FormState{
    email: string;
    password: string;
}

export default function Login(){

    const [form, setForm] = useState<FormState>({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        try {
          const res = await fetch('http://localhost:8080', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
      
          if (res.ok) {
            const data = await res.json();
            const token = data.token;
      
            localStorage.setItem('jwtToken', token);
      
            alert('Login successful!');
          } else {
            const errorMessage = await res.text();
            alert(`Login failed: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login.');
        }
      };
    return (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
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
      );
}