import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail, Pencil, Upload, Image, Video } from "lucide-react";
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

  // Upload Section State
  const [uploadType, setUploadType] = useState("image");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}
/profile/${userId}`);
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
      const res = await axios.put(`${import.meta.env.VITE_API_URL}
/profile/${userId}`, form);
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
        `${import.meta.env.VITE_API_URL}
/profile/upload/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    }
  };

  // New: handle post upload (image/video)
  const handleUploadPost = async () => {
    if (!uploadFile) return alert("Please select a file first.");
    const data = new FormData();
    data.append("file", uploadFile);
    data.append("type", uploadType);
    data.append("description", uploadDesc);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}
/profile/${userId}/uploadPost`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded successfully!");
      setUploadFile(null);
      setUploadDesc("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-wrapper">
            <img
              src={
                profile.image
                  ? `${import.meta.env.VITE_API_URL}
/${profile.image}`
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

          <div className="profile-info">
            <h3>{profile.name || "Your Name"}</h3>
            <div className="profile-details">
              <div className="profile-group">
                <p><MapPin size={16} /> {profile.city || "City"}</p>
                <p>
                  <Briefcase size={16} />{" "}
                  {Array.isArray(profile.skills)
                    ? profile.skills.join(", ")
                    : profile.skills || "Skills"}
                </p>
              </div>
              <div className="divider"></div>
              <div className="profile-group">
                <p><Phone size={16} /> {profile.phone || "Phone"}</p>
                <p><Mail size={16} /> {profile.email || "Email"}</p>
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

    {/* Upload Section */}
<div className="upload-section">
  <h3 className="upload-title">Share Something New</h3>

  <div className="upload-toggle">
    <button
      className={`toggle-btn ${uploadType === "image" ? "active" : ""}`}
      onClick={() => setUploadType("image")}
    >
      <Image size={18} /> Image
    </button>
    <button
      className={`toggle-btn ${uploadType === "video" ? "active" : ""}`}
      onClick={() => setUploadType("video")}
    >
      <Video size={18} /> Video
    </button>
  </div>

  <div className="upload-box">
    <input
      type="file"
      accept={uploadType === "image" ? "image/*" : "video/*"}
      onChange={(e) => setUploadFile(e.target.files[0])}
    />
    <textarea
      placeholder="Write a short description (optional)"
      value={uploadDesc}
      onChange={(e) => setUploadDesc(e.target.value)}
    />
    <button
      className="upload-btn"
      onClick={handleUploadPost}
      disabled={uploading}
    >
      {uploading ? "Uploading..." : <><Upload size={16} /> Upload</>}
    </button>
  </div>
</div>

    </div>
  );
};

export default ComProfile;
