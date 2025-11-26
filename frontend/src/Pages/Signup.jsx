import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import "../css/Signup.css";

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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        { email, password },
        { withCredentials: false }   // prevent browser blocking the request
      );

      // Accept 200 OR 201 as success
      if (res.status === 200 || res.status === 201) {
        setMessage("Account created successfully!");
        setMessageColor("green");
        setAccEmail(email);
        setTimeout(() => navigate("/"), 2000);
        return;
      }
   } catch (error) {
  console.log("🔥 DEBUG ERROR OBJECT:", error);

  if (error.response) {
    console.log("🔥 DEBUG RESPONSE DATA:", error.response.data);
    console.log("🔥 DEBUG STATUS:", error.response.status);

    setMessage(
      `DEBUG → ${error.response.status}: ${JSON.stringify(error.response.data)}`
    );
  } else if (error.request) {
    console.log("🔥 DEBUG NO SERVER RESPONSE:", error.request);
    setMessage("DEBUG → No response received from server");
  } else {
    console.log("🔥 DEBUG UNKNOWN ERROR:", error.message);
    setMessage(`DEBUG → ${error.message}`);
  }

  setMessageColor("red");
}

  };

  const handleLoginNavigation = () => {
    document.body.classList.add("page-fade-out");
    setTimeout(() => {
      navigate("/login");
      document.body.classList.remove("page-fade-out");
    }, 400);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="signup-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="signup-right">
          <div className="signup-illustration">
            <img src="/illustration.jpg" alt="Learning illustration" />
            <p>
              Learn, grow, and bridge your skills with{" "}
              <strong>SkillBridge</strong>.
            </p>
          </div>
        </div>

        <div className="signup-left">
          <div className="signup-form">
            <h1>Create Account</h1>
            <p className="signup-subtitle">
              Join the SkillBridge community and start your journey today.
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />

            <button className="signup-btn" onClick={handleSignup}>
              Sign Up
            </button>

            {message && (
              <p className="signup-message" style={{ color: messageColor }}>
                {message}
              </p>
            )}

            <p className="signup-login-text">
              Already have an account?{" "}
              <button onClick={handleLoginNavigation} className="signup-login-btn">
                Log in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Signup;
