import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');  // Type the state as string
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/validate-email?email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        alert('Email verified. You can now reset your password.');
        navigate('/reset-password');
      } else {
        const errorMessage = await res.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      alert('An error occurred while validating the email. Please try again.');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="lg" className="login-buttons w-100 mt-3">Validate Email</Button>
        </form>
      </div>
    </div>
  );
}
