import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";



const ComPeople = () => {
  const [profiles, setProfiles] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profiles");
        setProfiles(res.data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #eef2f7)",
      }}
    >
      <div className="container">
        <h2
          className="fw-bold text-center mb-5"
          style={{
            color: "#1f2937",
            letterSpacing: "0.5px",
            fontSize: "2rem",
          }}
        >
          Community Members
        </h2>

        {/* Grid Layout */}
        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {profiles.map((user) => (
            <div
              key={user._id}
              className="p-4 shadow-sm border h-100 d-flex flex-column align-items-center text-center"
              style={{
                borderRadius: "18px",
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.05)";
              }}
            >
              {/* Profile Image */}
              <img
                src={
                  user.image
                    ? `http://localhost:5000/${user.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt={user.name}
                className="rounded-circle mb-3 border"
                width="90"
                height="90"
                style={{
                  objectFit: "cover",
                  borderColor: "#cbd5e1",
                  transition: "transform 0.3s ease",
                }}
              />

              {/* Name */}
              <h5
                className="fw-semibold mb-1"
                style={{
                  color: "#1e293b",
                  fontSize: "1.05rem",
                }}
              >
                {user.name || "Unnamed"}
              </h5>

              {/* City */}
              <p
                className="mb-1 d-flex align-items-center justify-content-center text-muted"
                style={{ fontSize: "0.9rem" }}
              >
                <MapPin size={16} className="me-1 text-primary" />
                {user.city || "City"}
              </p>

              {/* Skills */}
              <p
                className="mb-2 d-flex align-items-center justify-content-center"
                style={{ fontSize: "0.9rem", color: "#475569" }}
              >
                <Briefcase size={16} className="me-1 text-info" />
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
<button
  className="btn btn-sm btn-primary mt-2"
  style={{ borderRadius: "12px" }}
  onClick={() => navigate(`/connected/${user.userId}`)}
>
  Connect
</button>


            </div>
          ))}

          {profiles.length === 0 && (
            <p className="text-center text-muted mt-5">
              No community members yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComPeople;
