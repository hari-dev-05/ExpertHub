import React from "react";
import { useNavigate } from "react-router-dom";

const MidLogin = () => {
  const navigate = useNavigate();

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
        zIndex: 1050,
      }}
    >
      <div
        className="bg-white p-4 rounded shadow text-center"
        style={{ width: "400px", maxWidth: "90%" }}
      >
        <h4 className="mb-3">Please Login</h4>
        <p className="mb-4">You need to log in to access the community page.</p>
        <button
          className="btn btn-primary w-100"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default MidLogin;
