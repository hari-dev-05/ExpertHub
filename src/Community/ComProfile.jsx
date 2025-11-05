import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail, Pencil } from "lucide-react";
import { useAuth } from "../Pages/AuthContext";
import "../css/ComProfile.css";

const ComProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const { setProfileEmail } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${userId}`);
        const data = res.data;
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          skills: data.skills || "",
        });
        setProfileEmail(data.email);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/profile/${userId}`, form);
      setProfile(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/profile/upload/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-card">
        <div className="profile-header">
          {/* Profile Picture */}
          <div className="profile-pic-wrapper">
            <img
              src={
                profile.image
                  ? `http://localhost:5000/${profile.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="profile-pic"
            />

            <label htmlFor="imageUpload" className="edit-icon">
              <Pencil size={14} />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Name & Info */}
          <div className="profile-info">
            <h3>{profile.name || "Your Name"}</h3>

            <div className="profile-details">
              <div className="profile-group">
                <p>
                  <MapPin size={16} /> {profile.city || "City"}
                </p>
                <p>
                  <Briefcase size={16} />{" "}
                  {Array.isArray(profile.skills)
                    ? profile.skills.join(", ")
                    : profile.skills || "Skills"}
                </p>
              </div>

              <div className="divider"></div>

              <div className="profile-group">
                <p>
                  <Phone size={16} /> {profile.phone || "Phone"}
                </p>
                <p>
                  <Mail size={16} /> {profile.email || "Email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Form */}
      <div className="form-section">
        {["name", "phone", "email", "city", "skills"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        <button className="update-btn" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ComProfile;
