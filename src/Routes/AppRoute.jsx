import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Pages/AuthContext"; // ✅ import AuthContext

import Nav from "../Components/Nav.jsx";
import Home from "../Pages/Home";
import Account from "../Pages/Account";
import Login from "../Pages/Login.jsx";
import Signup from "../Pages/Signup.jsx";

import CommunityLayout from "../Community/CommunityLayout"; // layout with <Outlet />
import ComHome from "../Community/ComHome.jsx";
import ComProfile from "../Community/ComProfile.jsx";
import ComPeople from "../Community/ComPeople.jsx";
import ConnectedPerson from "../Connect/ConnectedPerson.jsx";

const AppRoute = () => {
  const location = useLocation();
  const { user } = useAuth(); // ✅ get logged-in user

  // Pages where Navbar should NOT appear
  const hideNavbarPaths = ["/login", "/signup"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/connected/:userId" element={<ConnectedPerson />} />



        {/* COMMUNITY ROUTES with nested layout */}
        <Route path="/community" element={<CommunityLayout />}>
          <Route index element={<ComHome />} />          {/* /community */}
          <Route path="home" element={<ComHome />} />    {/* /community/home */}
          <Route
            path="profile"
            element={
              // ✅ pass userId to ComProfile only if user exists
              user ? <ComProfile userId={user._id} /> : <p>Loading...</p>
            }
          /> {/* /community/profile */}
          <Route path="people" element={<ComPeople />} />   {/* /community/people */}
        </Route>
      </Routes>
    </>
  );
};

export default AppRoute;
