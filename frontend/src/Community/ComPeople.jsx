import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";
import "../css/ComPeople.css";

const ComPeople = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const { profileEmail } = useAuth();

  useEffect(() => {
    if (!profileEmail) return;

    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles`);

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
    <div
      className="min-vh-100 py-5 community-wrapper"
      style={{
        background: "linear-gradient(135deg, #233d4d, #1b2e3a)",
      }}
    >
      <div className="container">
        <h2
          className="fw-bold text-center mb-5"
          style={{
            background: "linear-gradient(to right, #ff6b00, #ff8f3d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.2rem",
            letterSpacing: "1px",
            textShadow: "0 0 10px rgba(255, 107, 0, 0.35)",
          }}
        >
          Community Members
        </h2>

        {/* People Grid */}
        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {profiles.map((user) => (
            <div
              key={user._id}
              className="people-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(0,0,0,0.12)";
              }}
            >
              {/* IMAGE */}
             <img
  src={
    user.image
      ? user.image
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  }
  alt={user.name}
  className="people-img"
/>


              {/* NAME */}
              <h5 className="people-name">{user.name || "Unnamed"}</h5>

              {/* CITY */}
              <p className="people-info">
                <MapPin size={16} className="icon" />
                {user.city || "City"}
              </p>

              {/* SKILLS */}
             <div className="skill-box">
  {(Array.isArray(user.skills) ? user.skills.split(",") : [user.skills]).map((skill, index) => (
    <span key={index} className="skill-tag">
      {skill.trim()}
    </span>
  ))}
</div>


              <hr className="divider" />

              {/* PHONE */}
              <p className="people-contact">
                <Phone size={14} className="phone-icon" />
                {user.phone || "Phone"}
              </p>

              {/* EMAIL */}
              <p className="people-contact">
                <Mail size={14} className="mail-icon" />
                {user.email || "Email"}
              </p>

              {/* CONNECT BUTTON */}
              <button
                className="connect-btn"
                onClick={() => navigate(`/connected/${user.userId}`)}
              >
                Connect
              </button>
            </div>
          ))}

          {profiles.length === 0 && (
            <p className="text-center mt-5" style={{ color: "#ffb88a" }}>
              No community members yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComPeople;
