import React, { useState } from "react";
import "./AIBox.css";

const AIBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChat = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer || data.error);
  };

  const handleQuickTag = (tag) => {
    setQuestion(tag);
  };

  return (
    <div className="ai-box">
      <h2>🤖 Ask our AI Assistant</h2>
      <form className="ai-form" onSubmit={handleChat}>
        <div className="ai-input-wrapper">
          <span className="ai-icon">🔍</span>
          <input
            type="text"
            placeholder="Type your health concern or say it aloud... e.g., 'I have a headache'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="mic-button">
            🎤
          </button>
        </div>
      </form>

      <div className="quick-tags">
        {[
          "Headache relief",
          "Cold & flu",
          "Skin allergies",
          "Vitamin deficiency",
        ].map((tag) => (
          <button key={tag} onClick={() => handleQuickTag(tag)}>
            {tag}
          </button>
        ))}
      </div>

      {answer && (
        <p className="ai-response">
          <strong>AI answers:</strong> {answer}
        </p>
      )}
    </div>
  );
};

export default AIBox;
