import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext"; // make sure this is the updated AuthContext

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // store full user object

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

      // store the full user object in context + localStorage
      setUser(res.data.user);

      setMessage(res.data.message);
      setMessageColor("green");

      // navigate to home after login
      setTimeout(() => navigate("/"), 1500);
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
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url("/newimg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="text-center shadow-lg p-5 rounded-4"
        style={{
          width: "400px",
          minHeight: "420px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
        }}
      >
        <h2 className="fw-bold mb-4" style={{ letterSpacing: "1px" }}>
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mx-auto mb-4 bg-transparent border-0 border-bottom text-white rounded-0 shadow-none"
          style={{
            width: "80%",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mx-auto mb-4 bg-transparent border-0 border-bottom text-white rounded-0 shadow-none"
          style={{
            width: "80%",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
          }}
        />

        <button
          onClick={handleLogin}
          className="btn fw-semibold text-white rounded-pill py-2"
          style={{
            width: "80%",
            background: "rgba(0, 123, 255, 0.7)",
            backdropFilter: "blur(5px)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgba(0, 123, 255, 0.9)")}
          onMouseLeave={(e) => (e.target.style.background = "rgba(0, 123, 255, 0.7)")}
        >
          Login
        </button>

        {message && (
          <p className="mt-3 text-center" style={{ color: messageColor }}>
            {message}
          </p>
        )}

        <p className="mt-4" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="btn p-0 border-0 bg-transparent"
            style={{ color: "#00b4ff", textDecoration: "underline" }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
