import React from 'react';

const ComHome = () => {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Welcome to Expert Hub Community</h1>
        <p className="lead text-secondary">
          Connect, learn, and grow with like-minded learners and professionals.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Knowledge Sharing</h5>
              <p className="card-text">
                Post articles, tutorials, and resources to help others learn and grow.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0" style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: 'white' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Educational Videos</h5>
              <p className="card-text">
                Upload and watch videos for a visual and interactive learning experience.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Team Collaboration</h5>
              <p className="card-text">
                Form or join teams to collaborate on projects and share knowledge.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0" style={{ background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)', color: 'white' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Meetings & Discussions</h5>
              <p className="card-text">
                Arrange meetings and discussions to connect with peers and expand your network.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="fs-5 text-secondary">
          Join the community, participate actively, and enhance your skills and knowledge!
        </p>
      </div>
    </div>
  );
};

export default ComHome;
