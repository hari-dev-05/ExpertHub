import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Pages/AuthContext";

const Meeting = () => {
  const { userId } = useParams(); // receiver (the person you're scheduling with)
  const { user } = useAuth(); // logged-in user (sender)
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "",
  });

  // Fetch receiver profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}
/profile/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle meeting scheduling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email || !profile?.email) {
      alert("Missing sender or recipient email!");
      return;
    }

    const { subject, date, time, duration } = form;
    const from = user.email;
    const to = profile.email;

    // 🔗 Generate unique Jitsi meeting link with user's display name
    const meetingRoom = `meeting-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const meetingLink = `https://meet.jit.si/${meetingRoom}#userInfo.displayName="${encodeURIComponent(
      user.name || user.email
    )}"`;

    // 📨 Email body (includes meeting details + link)
    const bodyText = `
Hi ${profile.name || "there"},

I'd like to schedule a meeting with you.

📅 Date: ${date}
⏰ Time: ${time}
⏱ Duration: ${duration} minutes

🔗 Join the meeting here: ${meetingLink}

Thanks,
${from}
    `;

    const body = encodeURIComponent(bodyText);

    // 📧 Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=${to}&cc=${from}&su=${encodeURIComponent(
      subject
    )}&body=${body}`;

    // Open Gmail compose window
    window.open(gmailLink, "_blank", "noopener,noreferrer");

    // Optional: ask if sender wants to join immediately
    if (window.confirm("Meeting link generated! Do you want to join now?")) {
      window.open(meetingLink, "_blank");
    }
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
        {/* Sender Email */}
        <div className="mb-3">
          <label className="form-label">Sender Email</label>
          <input
            type="email"
            className="form-control"
            value={user?.email || ""}
            readOnly
          />
        </div>

        {/* Receiver Email */}
        <div className="mb-3">
          <label className="form-label">Receiver Email</label>
          <input
            type="email"
            className="form-control"
            value={profile?.email || ""}
            readOnly
          />
        </div>

        {/* Meeting Subject */}
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

        {/* Date */}
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

        {/* Time */}
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

        {/* Duration */}
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

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Create Meeting & Send Email
        </button>
      </form>
    </div>
  );
};

export default Meeting;
