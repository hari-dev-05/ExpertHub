import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";
import { motion } from "framer-motion";
import "../css/ComPeople.css";

const ComPeople = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const { profileEmail } = useAuth();

  useEffect(() => {
    if (!profileEmail) return;

    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profiles");
        const filteredData = res.data.filter(
          (p) => p.email && p.email !== profileEmail
        );
        setProfiles(filteredData);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles();
  }, [profileEmail]);

  return (
    <div className="community-wrapper">
      <motion.h2
        className="community-heading"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Community Members
      </motion.h2>

      <div className="community-grid">
        {profiles.map((user, index) => (
          <motion.div
            key={user._id}
            className="community-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              y: -8,
              boxShadow: "0 10px 30px rgba(255, 215, 0, 0.15)",
            }}
          >
            <img
              src={
                user.image
                  ? `http://localhost:5000/${user.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={user.name}
              className="profile-img"
            />

            <h5 className="profile-name">{user.name || "Unnamed"}</h5>

            <p className="profile-info">
              <MapPin size={16} className="icon yellow" />
              {user.city || "City"}
            </p>

            <p className="profile-info">
              <Briefcase size={16} className="icon" />
              {user.skills || "Skills"}
            </p>

              <hr
                style={{
                  width: "80%",
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  margin: "0.8rem 0",
                }}
              />

              {/* Contact */}
              <div style={{ fontSize: "0.85rem" }}>
                <p className="mb-1 d-flex justify-content-center align-items-center text-secondary">
                  <Phone size={14} className="me-1 text-success" />{" "}
                  {user.phone || "Phone"}
                </p>
                <p className="mb-0 d-flex justify-content-center align-items-center text-secondary">
                  <Mail size={14} className="me-1 text-danger" />{" "}
                  {user.email || "Email"}
                </p>
              </div>
<div className="d-flex gap-2 mt-3">
  <button
    className="btn btn-sm btn-primary"
    style={{ borderRadius: "12px" }}
    onClick={() => navigate(`/connected/${user.userId}`)}
  >
    Chat
  </button>

<button
  className="btn btn-sm btn-outline-primary"
  style={{ borderRadius: "12px" }}
  onClick={() =>
    navigate(`/checkprofile/${user.userId}`, { state: { user } })
  }
>
  Connect
</button>

</div>




            </div>
          </motion.div>
        ))}

        {profiles.length === 0 && (
          <p className="no-members">No community members yet.</p>
        )}
      </div>
    </div>
  );
};

export default ComPeople;
