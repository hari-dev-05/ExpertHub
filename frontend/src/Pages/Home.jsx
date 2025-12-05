import React from "react";
import { motion } from "framer-motion";

import "../css/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <span className="highlight">SkillBridge.</span>
          A community-driven learning platform.
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Learn, teach, and grow with people around the world.
          Build skills, share ideas, and connect meaningfully.
        </motion.p>

        <motion.button
          className="get-started-btn"
          onClick={() => navigate("/community")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>

      </motion.div>

      <div className="feature-row">
        {[
          "Free and Open Source",
          "Easy to Use",
          "Collaborative Learning",
          "Global Community",
          "Tiny Footprint"
        ].map((text, i) => (
          <motion.div
            key={i}
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <i className="fa-solid fa-star"></i>
            <p>{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
