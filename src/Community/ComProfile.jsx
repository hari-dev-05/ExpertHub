import React, { useState, useEffect } from "react";
import axios from "axios";

const ComProfile = ({ userId }) => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    skills: "",
    image: null,
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    skills: "",
  });

  // Fetch or create profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${userId}`);
        if (res.data) {
          setProfile(res.data);
          setForm({
            name: res.data.name || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
            city: res.data.city || "",
            skills: res.data.skills || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/profile/${userId}`, form);
      setProfile(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
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
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="container py-5">
      {/* PROFILE CARD */}
     <div className="d-flex flex-column flex-md-row align-items-center bg-light p-4 rounded shadow-sm mb-5">
  <div className="position-relative me-0 mb-3 mb-md-0">
    <img
      src={profile.image ? `http://localhost:5000/${profile.image}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
      alt="Profile"
      className="rounded-circle border border-2"
      width="120"
      height="120"
      style={{ objectFit: "cover" }}
    />
    <label
      htmlFor="imageUpload"
      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
      style={{ cursor: "pointer", fontSize: "14px" }}
    >
      ✏️
    </label>
    <input
      type="file"
      id="imageUpload"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleImageChange}
    />
  </div>
  <div className="ms-md-4 text-center text-md-start">
    <h3 className="fw-bold mb-1">{profile.name}</h3>
    <p className="mb-1">📞 <strong>{profile.phone}</strong></p>
    <p className="mb-1">📧 <strong>{profile.email}</strong></p>
    <p className="mb-1">📍 <strong>{profile.city}</strong></p>
    <p className="mb-0">💼 <strong>{profile.skills}</strong></p>
  </div>
</div>


      {/* INPUT GRID */}
      <div className="row g-4 text-start">
        {["name","phone","email","city","skills"].map((field) => (
          <div key={field} className={`col-12 col-md-${field==="city"||field==="skills"?6:4}`}>
            <label className="fw-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field==="email"?"email":"text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="form-control border-0 border-bottom"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>

      {/* UPDATE BUTTON */}
      <div className="text-center mt-4">
        <button className="btn btn-primary px-5" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ComProfile;
