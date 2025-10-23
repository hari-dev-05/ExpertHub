import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import {
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../Community/socket";
import { useAuth } from "../Pages/AuthContext";

const ConnectedPerson = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id;

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const chatEndRef = useRef(null);

  // ✅ Shared symmetric key for both users
  const chatKey =
    currentUserId && userId
      ? currentUserId < userId
        ? `chat_${currentUserId}_${userId}`
        : `chat_${userId}_${currentUserId}`
      : null;

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load saved chat from localStorage
  useEffect(() => {
    if (!chatKey) return;
    const stored = localStorage.getItem(chatKey);
    if (stored) setMessages(JSON.parse(stored));
  }, [chatKey]);

  // Fetch profile of the person you are chatting with
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

  // Listen for incoming messages
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

  // Handle sending messages
  const handleSend = () => {
    if (!newMsg.trim()) return;

    const updatedMessages = [...messages, { text: newMsg, senderId: currentUserId }];
    setMessages(updatedMessages);
    if (chatKey) localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    sendMessage({
      senderId: currentUserId,
      receiverId: userId,
      text: newMsg,
    });

    setNewMsg("");
  };

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this chat?")) {
      if (chatKey) localStorage.removeItem(chatKey);
      setMessages([]);
    }
  };

  if (!profile) return <p>Loading chat...</p>;

  return (
    <div
      className="container d-flex flex-column border rounded shadow-sm p-0"
      style={{ maxWidth: "600px", height: "80vh", backgroundColor: "#f9fafb" }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white"
        style={{ borderRadius: "10px 10px 0 0" }}
      >
        <div className="d-flex align-items-center gap-2">
          <ArrowLeft
            size={20}
            className="text-muted"
            style={{ cursor: "pointer" }}
            onClick={() => window.history.back()}
          />
          <img
            src={
              profile.image
                ? `http://localhost:5000/${profile.image}`
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

        {/* Clear Chat Button */}
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
                    isMe ? "bg-primary text-white" : "bg-white border text-dark"
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
  );
};

export default ConnectedPerson;
