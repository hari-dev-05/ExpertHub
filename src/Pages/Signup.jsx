import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Signup = () => {
  const { setAccEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      setMessage("Please fill in both fields.");
      setMessageColor("red");
      return;
    }

   try {
  await axios.post("http://localhost:5000/register", { email, password });
  setMessage("Account created successfully!");
  setMessageColor("green");
  setAccEmail(email);
  setTimeout(() => navigate("/"), 2000);
} catch (error) {
  if (error.response) {
    if (error.response.status === 409) {
      setMessage("This email is already registered. Please login.");
    } else {
      setMessage(error.response.data.message || "Something went wrong. Try again.");
    }
  } else {
    setMessage("Something went wrong. Try again.");
  }
  setMessageColor("red");
}

  };

  return (
    <div
      className="d-flex vh-100"
      style={{
      backgroundImage: `url("/newimg.jpg")`,
   backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left Section (clear view) */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-white p-5"
        style={{
          width: "50%",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(0px)", // no blur
        }}
      >
        <div
          style={{
           
            padding: "40px",
            borderRadius: "20px",
            width: "80%",
            textAlign: "center",
          }}
        >
          <h1 className="fw-bold mb-3">New To SkillBridge</h1>
          <p className="fs-5">
            Learn, grow, and bridge your skills with the best platform for
            learners and professionals alike.
          </p>
        </div>
      </div>

      {/* Right Section (blurred overlay) */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(2px)"
        }}
      >
        <div
          className="text-center  p-5 rounded-4"
          style={{
            width: "400px",
            minHeight: "400px"
          }}
        >
          <h2
            className="fw-bold mb-4"
            style={{ color: "#000000ff", letterSpacing: "1px" }}
          >
            Create Account
          </h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mx-auto mb-3 border-0 border-bottom border-primary rounded-0 shadow-none"
            style={{ width: "80%", background: "transparent" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mx-auto mb-3 border-0 border-bottom border-primary rounded-0 shadow-none"
            style={{ width: "80%", background: "transparent" }}
          />

          <button
            onClick={handleSignup}
            className="btn fw-semibold text-white rounded-pill py-2"
            style={{
              width: "80%",
              backgroundColor: "#000000ff",
              transition: "0.3s",
            }}
          >
            Sign Up
          </button>

          {message && (
            <p className="mt-3 text-center" style={{ color: messageColor }}>
              {message}
            </p>
          )}
<p className="mt-4" style={{ color: "#ffffff", fontSize: "0.9rem" }}>
  Already have an account?{" "}
  <button
    onClick={() => navigate("/login")}
    className="btn p-0 border-0 bg-transparent"
    style={{
      color: "#ffffff",
      textDecoration: "underline",
      fontWeight: "500",
      verticalAlign: "baseline",
    }}
  >
    Log in
  </button>
</p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
