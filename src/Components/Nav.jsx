import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";

const Nav = () => {
  const [open, setOpen] = useState(false); // Track toggle state
  const { accEmail } = useAuth();          // Get current user email

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Library Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)} // Toggle state
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse${open ? " show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto" onClick={() => setOpen(false)}>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/community">Community</Link>
            </li>

            {/* Show Login only if no active user */}
            {!accEmail && (
              <li className="nav-item me-3">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}

            {/* Show Account link if user is logged in */}
            <li className="nav-item">
              <Link className="nav-link" to="/account">Account</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
