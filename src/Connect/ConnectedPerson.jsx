import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConnectedPerson = () => {
  const { userId } = useParams(); // match the backend route
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${userId}`);
        // console.log("Profile data:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Safely handle skills whether it's a string or array
  const skills = Array.isArray(profile.skills)
    ? profile.skills.join(", ")
    : profile.skills;

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="p-5 shadow rounded text-center">
        <h3>{profile.name || "No name provided"}</h3>
        <p>{profile.city || "City not available"}</p>
        <p>{skills || "Skills not available"}</p>
        <p>{profile.email || "Email not available"}</p>
      </div>
    </div>
  );
};

export default ConnectedPerson;
