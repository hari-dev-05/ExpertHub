import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Briefcase, Phone, Mail, Pencil } from "lucide-react";

const ComProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
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
    <div className="container py-5">
      {/* Profile Header */}
      <div className="bg-light p-4 rounded shadow-sm mb-5">
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          {/* Profile Picture */}
          <div className="position-relative mb-3 mb-md-0 me-md-4">
            <img
              src={
                profile.image
                  ? `http://localhost:5000/${profile.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="rounded-circle border border-2"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />

            {/* Edit Icon */}
            <label
              htmlFor="imageUpload"
              className="position-absolute bottom-0 end-0 bg-white border border-secondary rounded-circle p-1 shadow-sm"
              style={{
                cursor: "pointer",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={14} className="text-secondary" />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Name and Info */}
          <div className="flex-grow-1 text-center text-md-start">
            <h3 className="mb-3">{profile.name || "Your Name"}</h3>

            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start align-items-center align-items-md-start gap-3">
              <div className="text-start">
                <p className="mb-2 d-flex align-items-center">
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <MapPin size={16} />
                  </span>
                  <span>{profile.city || "City"}</span>
                </p>

                <p className="mb-0 d-flex align-items-center">
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <Briefcase size={16} />
                  </span>
                  <span>
                    {Array.isArray(profile.skills)
                      ? profile.skills.join(", ")
                      : profile.skills || "Skills"}
                  </span>
                </p>
              </div>

              <div
                className="d-none d-md-block mx-3"
                style={{ width: "2px", backgroundColor: "#dcdcdc", height: "50px" }}
              ></div>

              <div className="text-start">
                <p className="mb-2 d-flex align-items-center">
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <Phone size={16} />
                  </span>
                  <span>{profile.phone || "Phone"}</span>
                </p>

                <p className="mb-0 d-flex align-items-center">
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <Mail size={16} />
                  </span>
                  <span>{profile.email || "Email"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="row g-4 text-start">
        {["name", "phone", "email", "city", "skills"].map((field) => (
          <div
            key={field}
            className={`col-12 col-md-${field === "city" || field === "skills" ? 6 : 4}`}
          >
            <label className="fw-semibold">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="form-control border-0 border-bottom"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>

      {/* Update Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary px-5" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ComProfile;
