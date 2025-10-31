import React from "react";
import "../index.css";
import { motion } from "framer-motion";

const Home = () => {
  const items = [
    {
      blue: "Start your journey",
      black: "by exploring new skills and ideas.",
      desc: "Discover new areas of knowledge and build the foundation for your personal and professional growth through interactive learning."
    },
    {
      blue: "Share your knowledge",
      black: "and help others grow.",
      desc: "Empower others by sharing what you’ve learned. Your insights can inspire and guide learners who are just beginning their path."
    },
    {
      blue: "Meet learners",
      black: "and mentors from around the world.",
      desc: "Connect globally with people who share your interests. Learn from diverse perspectives and make valuable friendships."
    },
    {
      blue: "Develop together",
      black: "and reach new milestones.",
      desc: "Collaborate with peers and mentors to overcome challenges and celebrate achievements as a team."
    }
  ];

  return (
    <div className="homebackground">
      <div className="container p-5" style={{ position: 'relative', zIndex: 2 }}>
        <motion.h1 
          className="fw-bold text-center mb-5 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Welcome to SkillBridge
        </motion.h1>
        <motion.p 
          className="lead text-center mb-5 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          A community where everyone can learn, teach, and grow together.
        </motion.p>

        {items.map((item, index) => (
          <motion.div
            className="section-box"
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="row align-items-center">
              {index % 2 === 0 ? (
                <>
                  {/* Text first */}
                  <div className="col-md-6">
                    <h2 className="fw-bold mb-3 display-5">
                      <span style={{ color: "#0d6efd" }}>{item.blue}</span>{" "}
                      <span style={{ color: "#000" }}>{item.black}</span>
                    </h2>
                    <p className="lead">{item.desc}</p>
                  </div>

                  {/* Image section */}
                  <div className="col-md-6 text-center">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <img
                        src="/newimg.jpg"
                        alt="main visual"
                        className="img-fluid rounded shadow-sm"
                        style={{
                          width: "50%",
                          height: "300px",
                          objectFit: "cover"
                        }}
                      />
                      <div
                        className="d-flex flex-column justify-content-between"
                        style={{ height: "300px", width: "50%", gap: "10px" }}
                      >
                        <img
                          src="/newimg.jpg"
                          alt="top visual"
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "48%",
                            objectFit: "cover"
                          }}
                        />
                        <img
                          src="/newimg.jpg"
                          alt="bottom visual"
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "48%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Image first */}
                  <div className="col-md-6 text-center">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <img
                        src="/newimg.jpg"
                        alt="main visual"
                        className="img-fluid rounded shadow-sm"
                        style={{
                          width: "50%",
                          height: "300px",
                          objectFit: "cover"
                        }}
                      />
                      <div
                        className="d-flex flex-column justify-content-between"
                        style={{ height: "300px", width: "50%", gap: "10px" }}
                      >
                        <img
                          src="/newimg.jpg"
                          alt="top visual"
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "48%",
                            objectFit: "cover"
                          }}
                        />
                        <img
                          src="/newimg.jpg"
                          alt="bottom visual"
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "48%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text second */}
                  <div className="col-md-6">
                    <h2 className="fw-bold mb-3 display-5">
                      <span style={{ color: "#0d6efd" }}>{item.blue}</span>{" "}
                      <span style={{ color: "#000" }}>{item.black}</span>
                    </h2>
                    <p className="lead">{item.desc}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
