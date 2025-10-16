import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-light vh-100 border-end">
      <h4 className="text-center mb-4 fw-bold">Community</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink 
            to="home" 
            className={({ isActive }) => "nav-link text-dark" + (isActive ? " active fw-bold" : "")}
          >
            🏠 Home
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink 
            to="profile" 
            className={({ isActive }) => "nav-link text-dark" + (isActive ? " active fw-bold" : "")}
          >
            👤 Profile
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink 
            to="people" 
            className={({ isActive }) => "nav-link text-dark" + (isActive ? " active fw-bold" : "")}
          >
            👥 People
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink 
            to="chat" 
            className={({ isActive }) => "nav-link text-dark" + (isActive ? " active fw-bold" : "")}
          >
            💬 Messages
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink 
            to="settings" 
            className={({ isActive }) => "nav-link text-dark" + (isActive ? " active fw-bold" : "")}
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto text-center border-top pt-3">
        <small className="text-muted">© 2025 ADEPTICODE</small>
      </div>
    </div>
  );
};

export default Sidebar;
