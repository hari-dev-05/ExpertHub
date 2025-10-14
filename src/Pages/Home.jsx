import React from "react";

const Home = () => {
  const items = [
    {
      title: "Learn",
      text: `Explore new skills from people around the community. Dive deep into
      tutorials, guides, and discussions shared by learners worldwide. Build
      expertise at your own pace and expand your horizons. Engage with
      content that matches your curiosity and grow your knowledge base every day.`
    },
    {
      title: "Teach",
      text: `Share your knowledge and help others grow with your skills. Whether
      it’s coding, design, or any other skill, your guidance can make a
      difference. Write articles, create tutorials, or conduct live sessions
      to help learners achieve their goals. Empower others through teaching.`
    },
    {
      title: "Connect",
      text: `Build strong connections with learners and teachers worldwide. Join
      discussion groups, participate in events, and collaborate on projects.
      Networking is the key to growth. Share ideas, ask questions, and
      establish meaningful relationships within the community.`
    },
    {
      title: "Grow",
      text: `Learn, teach, and grow together in a thriving community. Apply
      your skills to real-world challenges, receive feedback, and improve
      continuously. Celebrate milestones and achievements together. The
      journey of growth is better when shared with others.`
    }
  ];

  return (
    <div className="container my-5">
      <h1 className="fw-bold text-center mb-5">Welcome to SkillBridge</h1>
      <p className="lead text-center mb-5">
        A community where everyone can learn, teach, and grow together.
      </p>

      {/* Zig-zag timeline */}
      {items.map((item, index) => (
        <div
          key={index}
          className="d-flex mb-4"
          style={{
            justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
            minHeight: "180px", // increased height for content
          }}
        >
          <div
            style={{
              width: "50%",
              backgroundColor: "#f1f5f9",
              padding: "25px",
              borderRadius: "8px",
            }}
          >
            <h5 className="fw-bold">{item.title}</h5>
            <p className="mb-0" style={{ lineHeight: "1.6" }}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
