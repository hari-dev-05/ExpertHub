import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in both fields.");
      setMessageColor("red");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      setUser(res.data.user);
      setMessage(res.data.message);
      setMessageColor("green");

      // Smooth navigation transition
      document.body.classList.add("fade-out");
      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Try again.");
      }
      setMessageColor("red");
    }
  };

  return (
    <div className="login-page">
      {/* Left Section - Form */}
      <div className="login-left">
        <div className="login-box">
          <h2>Welcome back!</h2>
          <p className="subtitle">
            Simplify your workflow and boost your productivity with{" "}
            <strong>Expert Hub</strong>. Get started for free.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <div className="forgot-password">Forgot Password?</div>

          <button onClick={handleLogin} className="login-btn">
            Login
          </button>

          {message && (
            <p className="message" style={{ color: messageColor }}>
              {message}
            </p>
          )}

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-icon google">
              <i className="fa-brands fa-google"></i>
            </button>
            <button className="social-icon apple">
              <i className="fa-brands fa-apple"></i>
            </button>
            <button className="social-icon facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </button>
          </div>

          <p className="register-text">
            Not a member?{" "}
            <button
              onClick={() => {
                document.body.classList.add("fade-out");
                setTimeout(() => navigate("/signup"), 400);
              }}
              className="register-link"
            >
              Register now
            </button>
          </p>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="login-right">
        <img src="/illustratio.jpg" alt="illustration" className="login-illustration" />
        <h3>
          Make your work easier and organized <br />
          with <strong>Expert Hub</strong>
        </h3>
      </div>
    </div>
  );
}

export default Login;
