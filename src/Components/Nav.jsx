
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import "../css/Nav.css";


const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="motion-nav">
      <div className="nav-left">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-icon">Sb</div>
        </NavLink>
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
          onClick={() => setOpen(false)}
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
          onClick={() => setOpen(false)}
        >
          Community
        </NavLink>

        <NavLink
          to="/tutorials"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
          onClick={() => setOpen(false)}
        >
          About
        </NavLink>

        {user && (
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            Account
          </NavLink>
        )}
      </div>

      <div className="nav-right">
        {!user && (
          <NavLink to="/login" className="nav-button" onClick={() => setOpen(false)}>
            Login
          </NavLink>
        )}
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Nav;
