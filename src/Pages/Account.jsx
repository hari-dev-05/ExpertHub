import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { accEmail, setAccEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccEmail("");                 // Clear React context
    localStorage.removeItem("accEmail"); // Clear localStorage
    navigate("/login");              // Redirect to login page
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #007bff 40%, #e3f2fd 100%)" }}
    >
      <div
        className="text-center bg-white shadow-lg p-5 rounded-4"
        style={{ width: "400px", minHeight: "300px", borderTop: "5px solid #007bff" }}
      >
        <h2 className="fw-bold mb-4" style={{ color: "#007bff", letterSpacing: "1px" }}>
          Account Details
        </h2>

        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom mb-3">
          <h5 className="mb-0">Email:</h5>
          <p className="mb-0">{accEmail}</p>
        </div>

        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          This is your registered email. You can use it to login anywhere.
        </p>

        <button
          onClick={handleLogout}
          className="btn btn-outline-danger mt-4 rounded-pill px-4 py-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
