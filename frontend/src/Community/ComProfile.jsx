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

  const [uploadType, setUploadType] = useState("image");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile/${userId}`);
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
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found</p>;

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/profile/${userId}`, form);
      setProfile(res.data);
      alert("Profile updated!");
    } catch (err) {
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
        `${import.meta.env.VITE_API_URL}/profile/upload/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile(res.data.profile);
    } catch (err) {
      alert("Image upload failed");
    }
  };

  const handleUploadPost = async () => {
    if (!uploadFile) return alert("Select a file!");
    const data = new FormData();
    data.append("file", uploadFile);
    data.append("type", uploadType);
    data.append("description", uploadDesc);

    try {
      setUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/profile/${userId}/uploadPost`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Uploaded!");
      setUploadDesc("");
      setUploadFile(null);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">

      {/* ===== TOP PROFILE CARD ===== */}
      <div className="profile-card">

        {/* LEFT: IMAGE */}
        <div className="pic-section">
          <div className="profile-pic-wrapper">
            <img
              src={
                profile.image
                  ? `${import.meta.env.VITE_API_URL}/${profile.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="profile-pic"
            />

            <label htmlFor="imageUpload" className="edit-icon">
              <Pencil size={14} />
            </label>
            <input id="imageUpload" type="file" onChange={handleImageChange} style={{ display: "none" }} />
          </div>
        </div>

        {/* RIGHT: DETAILS + FORM */}
     <div className="details-section">
  
  {/* DETAILS DISPLAY BLOCK */}
  <div className="display-block">
    <h2 className="profile-name">{form.name || "Your Name"}</h2>

    <div className="info-row">
      <MapPin size={16} />
      <span>{form.city || "City"}</span>
    </div>

    <div className="info-row">
      <Briefcase size={16} />
      <span>{form.skills || "Skills"}</span>
    </div>

    <div className="info-row">
      <Phone size={16} />
      <span>{form.phone || "Phone"}</span>
    </div>

    <div className="info-row">
      <Mail size={16} />
      <span>{form.email || "Email"}</span>
    </div>
  </div>


          {/* FORM INPUTS */}
          <div className="form-inputs">
            {["name", "phone", "email", "city", "skills"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={form[field]}
                placeholder={`Enter ${field}`}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="profile-input"
              />
            ))}

            <button className="update-btn" onClick={handleUpdate}>Update Profile</button>
          </div>
        </div>
      </div>


      {/* ===== SEPARATE WHITE UPLOAD SECTION ===== */}
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
          <input type="file" accept={uploadType + "/*"} onChange={(e) => setUploadFile(e.target.files[0])} />
          <textarea
            placeholder="Description (optional)"
            value={uploadDesc}
            onChange={(e) => setUploadDesc(e.target.value)}
          />
          <button className="upload-btn" onClick={handleUploadPost} disabled={uploading}>
            {uploading ? "Uploading..." : <> <Upload size={16} /> Upload </>}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ComProfile;
