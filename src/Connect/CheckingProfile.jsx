import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Phone, Mail, MessageCircle } from "lucide-react";

const CheckProfile = () => {
  const { state } = useLocation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = state?.user; // safely access user data

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h4 className="text-danger">No profile data found!</h4>
        <p>Please go back and select a profile again.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Profile Header */}
      <div className="bg-white p-4 rounded shadow-sm mb-5 border">
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          {/* Profile Picture */}
          <div className="position-relative mb-3 mb-md-0 me-md-4">
            <img
              src={
                user.image
                  ? `http://localhost:5000/${user.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={user.name}
              className="rounded-circle border border-2"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Name and Info */}
          <div className="flex-grow-1 text-center text-md-start">
            <h3 className="mb-3 fw-bold" style={{ color: "#1f2937" }}>
              {user.name || "Unnamed User"}
            </h3>

            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start align-items-center align-items-md-start gap-3">
              <div className="text-start">
                <p
                  className="mb-2 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#2563eb" }}
                  >
                    <MapPin size={16} />
                  </span>
                  <span>{user.city || "City"}</span>
                </p>

                <p
                  className="mb-0 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#0ea5e9" }}
                  >
                    <Briefcase size={16} />
                  </span>
                  <span>
                    {Array.isArray(user.skills)
                      ? user.skills.join(", ")
                      : user.skills || "Skills"}
                  </span>
                </p>
              </div>

              <div
                className="d-none d-md-block mx-3"
                style={{
                  width: "2px",
                  backgroundColor: "#e5e7eb",
                  height: "50px",
                }}
              ></div>

              <div className="text-start">
                <p
                  className="mb-2 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#22c55e" }}
                  >
                    <Phone size={16} />
                  </span>
                  <span>{user.phone || "Phone"}</span>
                </p>

                <p
                  className="mb-0 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#ef4444" }}
                  >
                    <Mail size={16} />
                  </span>
                  <span>{user.email || "Email"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-4 rounded shadow-sm border">
        <h5 className="fw-semibold mb-3" style={{ color: "#1e293b" }}>
          About
        </h5>
        <p style={{ color: "#475569" }}>
          {user.about ||
            "This user hasn’t added additional details yet. You can connect to know more."}
        </p>
      </div>

   
    </div>
  );
};

export default CheckProfile;
