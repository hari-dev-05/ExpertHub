import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Pages/AuthContext";
import "../css/Group.css";

const Group = () => {
  const { user } = useAuth(); // ✅ get logged-in user from context
  const userId = user?._id;   // ✅ extract userId safely
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}
/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);


  if (loading) return <p>Loading posts...</p>;

return (
  <div className="feed-container">
    <h2 className="feed-title">Your Posts</h2>

    {posts.length === 0 ? (
      <p className="empty-feed">No posts found.</p>
    ) : (
      posts.map((post) => (
        <div key={post._id} className="post-card">
          {post.fileType === "image" ? (
            <img
              src={`${import.meta.env.VITE_API_URL}
${post.fileUrl}`}
              alt="Post"
              className="post-media"
            />
          ) : (
            <video
              src={`${import.meta.env.VITE_API_URL}
${post.fileUrl}`}
              controls
              className="post-media"
            />
          )}
          <p className="post-desc">{post.description}</p>
          <p className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      ))
    )}
  </div>
);

};

export default Group;
