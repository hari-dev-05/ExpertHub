import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "../Components/Nav.jsx";

import Home from "../Pages/Home";
import About from "../Pages/About";
import Community from "../Pages/Community";
import Account from "../Pages/Account";
import Login from "../Pages/Login.jsx";
import Signup from "../Pages/Signup.jsx";
import { useLocation } from "react-router-dom";

const AppRoute = () =>{
 const location = useLocation(); // Get current path

  // Pages where Navbar should NOT appear
  const hideNavbarPaths = ["/login", "/signup"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/community" element={<Community />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default AppRoute;
