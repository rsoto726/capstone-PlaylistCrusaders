import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css';

// Define a type for the form state
interface FormState {
  email: string;
  password: string;
}

export default function ResetPassword() {
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const navigate = useNavigate();

  // Handle input change with proper typing for the event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form); // Debug

    try {
      // Send the email and new password as a JSON body
      const res = await fetch('http://localhost:8080/api/user/reset-password', {
        method: 'PUT',  // Ensure using PUT method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (res.ok) {
        alert('Password reset successfully!');
        navigate('/login');
      } else {
        const errorMessage = await res.text();
        alert(`Reset failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred while resetting the password. Please try again.');
    }
  };

  return (
    <div className='login-page'>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
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
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="primary" size="lg" className="login-buttons w-100 mt-3">Reset Password</Button>
        </form>
      </div>
    </div>
  );
}
