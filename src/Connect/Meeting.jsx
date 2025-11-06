import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Pages/AuthContext";

const Meeting = () => {
  const { userId } = useParams(); // person you're scheduling with
  const { user } = useAuth(); // logged-in user
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email || !profile?.email) {
      alert("Missing sender or recipient email!");
      return;
    }

    const { subject, date, time, duration } = form;
    const from = user.email;
    const to = profile.email;

    // Clean email body using template literals and encodeURIComponent
    const bodyText = `
Hi ${profile.name || "there"},

I’d like to schedule a meeting with you.

Details:
Date: ${date}
Time: ${time}
Duration: ${duration} minutes

Thanks,
${from}
    `;
    const body = encodeURIComponent(bodyText);

    // Gmail compose link
const gmailLink = `https://mail.google.com/mail/?view=cm&to=${to}&cc=${from}&su=${encodeURIComponent(
  subject
)}&body=${body}`;


    window.open(gmailLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mt-5 text-dark" style={{ maxWidth: "600px" }}>
      <h4 className="mb-4 text-center">
        Schedule Meeting with {profile?.name || "User"}
      </h4>

      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-white"
      >
        {/* Locked Emails */}
        <div className="mb-3">
          <label className="form-label">Sender Email</label>
          <input
            type="email"
            className="form-control"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Receiver Email</label>
          <input
            type="email"
            className="form-control"
            value={profile?.email || ""}
            readOnly
          />
        </div>

        {/* Editable Fields */}
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            className="form-control"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            name="time"
            className="form-control"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            className="form-control"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Open Email App to Send
        </button>
      </form>
    </div>
  );
};

export default Meeting;
