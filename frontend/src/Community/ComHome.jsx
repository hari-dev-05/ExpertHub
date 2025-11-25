import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "../css/Community.css";

const ComHome = () => {
  const { scrollY } = useScroll();

  // Parallax effect
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const y3 = useTransform(scrollY, [0, 300], [0, -150]);
  const y4 = useTransform(scrollY, [0, 300], [0, -200]);

  return (
    <div className="community-home">
      <motion.h1
        className="community-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="highlight-text">Expert Hub Community</span>
      </motion.h1>

      <motion.p
        className="community-subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Connect, learn, and grow with like-minded learners and professionals.
      </motion.p>

      <div className="community-cards">
        <motion.div className="card-box purple" style={{ y: y1 }}>
          <h5>Knowledge Sharing</h5>
          <p>Post articles, tutorials, and resources to help others learn and grow.</p>
        </motion.div>

        <motion.div className="card-box orange" style={{ y: y2 }}>
          <h5>Educational Videos</h5>
          <p>Upload and watch videos for a visual and interactive learning experience.</p>
        </motion.div>

        <motion.div className="card-box green" style={{ y: y3 }}>
          <h5>Team Collaboration</h5>
          <p>Form or join teams to collaborate on projects and share knowledge.</p>
        </motion.div>

        <motion.div className="card-box red" style={{ y: y4 }}>
          <h5>Meetings & Discussions</h5>
          <p>Arrange meetings and discussions to connect with peers and expand your network.</p>
        </motion.div>
      </div>

      <p className="community-footer">
        Join the community, participate actively, and enhance your skills and knowledge!
      </p>
    </div>
  );
};

export default ComHome;
