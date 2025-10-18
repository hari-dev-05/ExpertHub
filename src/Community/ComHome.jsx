import React from "react";

const ComHome = () => {
  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f9fafb, #eef2f7)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-5 px-3">
        <h1
          className="fw-bold mb-3"
          style={{
            color: "#1e293b",
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            lineHeight: 1.2,
          }}
        >
          Welcome to <span className="text-primary">Expert Hub Community</span>
        </h1>
        <p
          className="lead text-secondary"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Connect, learn, and grow with like-minded learners and professionals.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="row g-4 px-2 px-md-0">
        {/* Card 1 */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm h-100 border-0"
            style={{
              background:
                "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              borderRadius: "16px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-2 fs-5">
                Knowledge Sharing
              </h5>
              <p className="card-text mb-0">
                Post articles, tutorials, and resources to help others learn and grow.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm h-100 border-0"
            style={{
              background:
                "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
              color: "white",
              borderRadius: "16px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-2 fs-5">
                Educational Videos
              </h5>
              <p className="card-text mb-0">
                Upload and watch videos for a visual and interactive learning experience.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm h-100 border-0"
            style={{
              background:
                "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              color: "white",
              borderRadius: "16px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-2 fs-5">
                Team Collaboration
              </h5>
              <p className="card-text mb-0">
                Form or join teams to collaborate on projects and share knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm h-100 border-0"
            style={{
              background:
                "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
              color: "white",
              borderRadius: "16px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.05)";
            }}
          >
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-2 fs-5">
                Meetings & Discussions
              </h5>
              <p className="card-text mb-0">
                Arrange meetings and discussions to connect with peers and expand your network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-5 px-3">
        <p
          className="fs-6 text-secondary"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Join the community, participate actively, and enhance your skills and knowledge!
        </p>
      </div>
    </div>
  );
};

export default ComHome;
