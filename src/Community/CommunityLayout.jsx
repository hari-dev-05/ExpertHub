import React, { useEffect, useState } from "react";
import Sidebar from "../Community/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";

const CommunityLayout = () => {
  const { user } = useAuth(); // use full user object
  const navigate = useNavigate();
  const [authLoaded, setAuthLoaded] = useState(false); // wait for AuthContext load
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Mark auth as loaded when user state is ready
    setAuthLoaded(true);
  }, [user]);

  useEffect(() => {
    let timer;
    if (authLoaded && !user) {
      timer = setTimeout(() => setShowLoginModal(true), 3000); // 3 sec delay
    } else {
      setShowLoginModal(false);
    }
    return () => clearTimeout(timer);
  }, [authLoaded, user]);

  const isLoggedIn = Boolean(user);

  return (
    <div className="position-relative">
      <div className={showLoginModal ? "blurred" : ""}>
        <div className="container-fluid">
          <div className="row min-vh-100">
            <div className="col-12 col-md-3 col-lg-2 bg-light border-end p-0">
              <Sidebar />
            </div>
            <div className="col-12 col-md-9 col-lg-10 p-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

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
