import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();  // <-- use user instead of accEmail

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Expert Hub</Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse${open ? " show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/" onClick={() => setOpen(false)}>Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/community" onClick={() => setOpen(false)}>Community</Link>
            </li>

            {!user && (
              <li className="nav-item me-3">
                <Link className="nav-link" to="/login" onClick={() => setOpen(false)}>Login</Link>
              </li>
            )}

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/account" onClick={() => setOpen(false)}>Account</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
