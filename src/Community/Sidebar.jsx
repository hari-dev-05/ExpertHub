import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Users, MessageCircle, Settings } from "lucide-react";
import "../css/Community.css";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: <Home size={18} />, path: "/community/home" },
    { name: "Profile", icon: <User size={18} />, path: "/community/profile" },
    { name: "People", icon: <Users size={18} />, path: "/community/people" },
    { name: "Messages", icon: <MessageCircle size={18} />, path: "/community/messages" },
    { name: "Settings", icon: <Settings size={18} />, path: "/community/settings" },
  ];

  return (
    <div className="sidebar d-flex flex-column p-3 h-100">
      <h4 className="fw-bold mb-4 text-center text-white">Community</h4>

      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `sidebar-link d-flex align-items-center gap-2 px-3 py-2 mb-2 rounded-3 ${
              isActive ? "active" : ""
            }`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};
export default Sidebar;