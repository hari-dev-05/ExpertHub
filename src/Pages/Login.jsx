import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Login() {
  const navigate = useNavigate();
  const { setAccEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please fill in both fields.');
      setMessageColor('red');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      setMessage(res.data.message);
      setMessageColor('green');
      setAccEmail(email);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Try again.');
      }
      setMessageColor('red');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #092849ff 40%, #e3f2fd 100%)" }}
    >
      <div
        className="text-center bg-white shadow-lg p-5 rounded-4"
        style={{ width: "400px", minHeight: "400px", borderTop: "5px solid #007bff" }}
      >
        <h2 className="fw-bold mb-4" style={{ color: "#007bff", letterSpacing: "1px" }}>
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mx-auto mb-3 border-0 border-bottom border-primary rounded-0 shadow-none"
          style={{ width: "80%", background: "#f8f9fa" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mx-auto mb-3 border-0 border-bottom border-primary rounded-0 shadow-none"
          style={{ width: "80%", background: "#f8f9fa" }}
        />

        <button
          onClick={handleLogin}
          className="btn fw-semibold text-white rounded-pill py-2"
          style={{ width: "80%", backgroundColor: "#007bff", transition: "0.3s" }}
        >
          Login
        </button>

        {message && (
          <p className="mt-3 text-center" style={{ color: messageColor }}>
            {message}
          </p>
        )}

        <p className="mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="btn p-0 border-0 bg-transparent"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
