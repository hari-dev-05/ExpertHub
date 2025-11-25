import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Briefcase,
  Phone,
  Mail,
  ArrowLeft,
  Send,
  Trash2,
} from "lucide-react";
import {
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../Community/socket";
import { useAuth } from "../Pages/AuthContext";
import { useNavigate } from "react-router-dom";

const ConnectedPerson = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id;
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showChat, setShowChat] = useState(false); // ✅ toggle chat visibility

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const chatKey =
    currentUserId && userId
      ? currentUserId < userId
        ? `chat_${currentUserId}_${userId}`
        : `chat_${userId}_${currentUserId}`
      : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentUserId || !userId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/${currentUserId}/${userId}`
        );
        if (res.data && res.data.length > 0) {
          setMessages(res.data);
          if (chatKey) localStorage.setItem(chatKey, JSON.stringify(res.data));
        } else {
          const stored = localStorage.getItem(chatKey);
          if (stored) setMessages(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        const stored = localStorage.getItem(chatKey);
        if (stored) setMessages(JSON.parse(stored));
      }
    };

    fetchMessages();
  }, [currentUserId, userId, chatKey]);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile/${userId}`);
      setProfile(res.data);

      // ✅ Log both emails once profile is loaded
      console.log("Logged-in user email:", user?.email);
      console.log("Profile email:", res.data?.email);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  fetchProfile();
}, [userId, user?.email]);


  useEffect(() => {
    if (!currentUserId) return;

    subscribeToMessages(({ senderId, text }) => {
      setMessages((prev) => {
        const updated = [...prev, { text, senderId }];
        if (chatKey) localStorage.setItem(chatKey, JSON.stringify(updated));
        return updated;
      });
    });

    return () => unsubscribeFromMessages();
  }, [currentUserId, userId, chatKey]);

  const handleSend = () => {
    if (!newMsg.trim()) return;

    const updatedMessages = [
      ...messages,
      { text: newMsg, senderId: currentUserId },
    ];
    setMessages(updatedMessages);
    if (chatKey) localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    sendMessage({
      senderId: currentUserId,
      receiverId: userId,
      text: newMsg,
    });

    setNewMsg("");
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/messages/${currentUserId}/${userId}`
      );
      if (chatKey) localStorage.removeItem(chatKey);
      setMessages([]);
      alert("Chat cleared successfully!");
    } catch (err) {
      console.error("Error clearing chat:", err);
      alert("Failed to clear chat. Try again later.");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      {/* --- Profile Header Section --- */}
      <div className="bg-white p-4 rounded shadow-sm mb-4 border">
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          {/* Profile Picture */}
          <div className="position-relative mb-3 mb-md-0 me-md-4">
            <img
              src={
                profile?.image
                  ? `${import.meta.env.VITE_API_URL}/${profile.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={profile?.name}
              className="rounded-circle border border-2"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Name and Info */}
          <div className="flex-grow-1 text-center text-md-start">
            <h3 className="mb-3 fw-bold" style={{ color: "#1f2937" }}>
              {profile?.name || "Unnamed User"}
            </h3>

            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start align-items-center align-items-md-start gap-3">
              <div className="text-start">
                <p
                  className="mb-2 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#2563eb" }}
                  >
                    <MapPin size={16} />
                  </span>
                  <span>{profile?.city || "City"}</span>
                </p>

                <p
                  className="mb-0 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#0ea5e9" }}
                  >
                    <Briefcase size={16} />
                  </span>
                  <span>
                    {Array.isArray(profile?.skills)
                      ? profile.skills.join(", ")
                      : profile?.skills || "Skills"}
                  </span>
                </p>
              </div>

              <div
                className="d-none d-md-block mx-3"
                style={{
                  width: "2px",
                  backgroundColor: "#e5e7eb",
                  height: "50px",
                }}
              ></div>

              <div className="text-start">
                <p
                  className="mb-2 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#22c55e" }}
                  >
                    <Phone size={16} />
                  </span>
                  <span>{profile?.phone || "Phone"}</span>
                </p>

                <p
                  className="mb-0 d-flex align-items-center"
                  style={{ color: "#374151" }}
                >
                  <span
                    className="border rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: "28px", height: "28px", color: "#ef4444" }}
                  >
                    <Mail size={16} />
                  </span>
                  <span>{profile?.email || "Email"}</span>
                </p>
              </div>

              {/* ✅ Chat Button */}
              <div>
                <button
                  className="btn btn-primary "
                  onClick={() => setShowChat((prev) => !prev)}
                >
                  {showChat ? "Close Chat" : "Chat"}
                </button>
              </div>
              <div>
              <button
  className="btn btn-outline-primary"
onClick={() => navigate(`/meeting/${userId}`)}

>
  Schedule Meeting
</button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Chat Section (Visible when Chat button clicked) --- */}
      {showChat && (
        <div
          className="container d-flex flex-column border rounded shadow-sm p-0"
          style={{
            maxWidth: "600px",
            height: "80vh",
            backgroundColor: "#f9fafb",
          }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
            <div className="d-flex align-items-center gap-2">
              <ArrowLeft
                size={20}
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => setShowChat(false)}
              />
              <img
                src={
                  profile.image
                    ? `${import.meta.env.VITE_API_URL}/${profile.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt={profile.name}
                className="rounded-circle border"
                width="40"
                height="40"
              />
              <div>
                <h6 className="mb-0">{profile.name}</h6>
                <small className="text-muted">{profile.city}</small>
              </div>
            </div>

            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={handleClearChat}
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>

          {/* Chat Area */}
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ backgroundColor: "#f1f5f9" }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <small>Start your conversation with {profile.name}</small>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={i}
                    className={`d-flex mb-2 ${
                      isMe ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-3 ${
                        isMe
                          ? "bg-primary text-white"
                          : "bg-white border text-dark"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="d-flex align-items-center p-2 border-top bg-white">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-primary rounded-circle ms-2"
              onClick={handleSend}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedPerson;
