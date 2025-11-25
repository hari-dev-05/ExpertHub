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

        {/* Grid */}
        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {profiles.map((user) => (
            <div
              key={user._id}
              className="p-4 border h-100 d-flex flex-column align-items-center text-center"
              style={{
                borderRadius: "18px",
                background: "rgba(35, 61, 77, 0.88)",
                borderColor: "rgba(255, 107, 0, 0.3)",
                boxShadow: "0 0 18px rgba(0,0,0,0.2)",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 5px 12px rgba(0,0,0,0.25)";
              }}
            >
              {/* Profile Image */}
              <img
                src={user.image? `${import.meta.env.VITE_API_URL}/${user.image}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"  }
                alt={user.name}
                className="rounded-circle mb-3"
                width="90"
                height="90"
                style={{
                  objectFit: "cover",
                  border: "2px solid #ff6b00",
                  padding: "2px",
                  transition: "0.3s ease",
                }}
              />

              {/* Name */}
              <h5
                className="fw-semibold mb-1"
                style={{ color: "#ffffff", fontSize: "1.1rem" }}
              >
                {user.name || "Unnamed"}
              </h5>

              {/* City */}
              <p
                className="mb-1 d-flex align-items-center justify-content-center"
                style={{ fontSize: "0.9rem", color: "#d1d7db" }}
              >
                <MapPin size={16} className="me-1" color="#ff6b00" />
                {user.city || "City"}
              </p>

              {/* Skills */}
              <p
                className="mb-2 d-flex align-items-center justify-content-center"
                style={{ fontSize: "0.9rem", color: "#ffb88a" }}
              >
                <Briefcase size={16} className="me-1" color="#ff6b00" />
                {user.skills || "Skills"}
              </p>

              <hr
                style={{
                  width: "80%",
                  borderTop: "1px solid rgba(255, 107, 0, 0.35)",
                }}
              />

              {/* Contact */}
              <div style={{ fontSize: "0.85rem", color: "#e6e6e6" }}>
                <p className="mb-1 d-flex justify-content-center align-items-center">
                  <Phone size={14} className="me-1" color="#22c55e" />
                  {user.phone || "Phone"}
                </p>

                <p className="mb-0 d-flex justify-content-center align-items-center">
                  <Mail size={14} className="me-1" color="#ef4444" />
                  {user.email || "Email"}
                </p>
              </div>

              {/* Connect Button */}
              <div className="d-flex gap-2 mt-3">
               <button
  className="btn btn-sm"
  style={{
    background: "#ff6b00",
    borderRadius: "12px",
    border: "none",
    fontWeight: 600,
    color: "#000",
    padding: "6px 18px",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ffffff"; // white
    e.currentTarget.style.color = "#000000"; // black text
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#ff6b00"; // pumpkin orange
    e.currentTarget.style.color = "#000000"; // black text
  }}
  onClick={() => navigate(`/connected/${user.userId}`)}
>
  Connect
</button>


              </div>
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
