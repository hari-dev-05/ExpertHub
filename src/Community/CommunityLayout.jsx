import React from "react";
import Sidebar from "../Community/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";

const CommunityLayout = () => {
  const { accEmail } = useAuth(); // get logged-in email
  const navigate = useNavigate();

  // true if user is NOT logged in
  const isLoggedIn = Boolean(accEmail);
  const showLoginModal = !isLoggedIn;

  return (
    <div className="position-relative">
      {/* Main page content with blur if not logged in */}
      <div className={showLoginModal ? "blurred" : ""}>
        <div className="container-fluid">
          <div className="row min-vh-100">
            <div className="col-12 col-md-3 col-lg-2 bg-light border-end p-0">
              <Sidebar />
            </div>
            <div className="col-12 col-md-9 col-lg-10 p-3">
              <Outlet /> {/* Nested routes render here */}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow text-center"
            style={{ width: "400px", maxWidth: "90%" }}
          >
            <h3 className="mb-3">Please login to access the Community page</h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Blur CSS */}
      <style>{`
        .blurred {
          filter: blur(4px);
          pointer-events: none;
          user-select: none;
          transition: filter 0.3s;
        }
      `}</style>
    </div>
  );
};

export default CommunityLayout;
