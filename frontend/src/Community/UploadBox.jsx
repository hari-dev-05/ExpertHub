import React, { useState } from "react";
import axios from "axios";
import { Upload, Image, Video } from "lucide-react";

const UploadBox = ({ userId }) => {
  const [uploadType, setUploadType] = useState("image");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUploadPost = async () => {
    if (!uploadFile) return alert("Select a file!");

    const data = new FormData();
    data.append("file", uploadFile);
    data.append("type", uploadType);
    data.append("description", uploadDesc);

    try {
      setUploading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/${userId}/uploadPost`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

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
          accept={uploadType + "/*"}
          onChange={(e) => setUploadFile(e.target.files[0])}
        />

        <textarea
          placeholder="Description (optional)"
          value={uploadDesc}
          onChange={(e) => setUploadDesc(e.target.value)}
        />

        <button
          className="upload-btn"
          onClick={handleUploadPost}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : <>
            <Upload size={16} /> Upload
          </>}
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
