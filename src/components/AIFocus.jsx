import React from "react";

const AIFocus = ({ aiPositioning }) => {
  if (!aiPositioning) {
    return null;
  }

  const highlights = aiPositioning.highlights || [];
  const keywords = aiPositioning.keywords || [];

  return (
    <section id="ai-focus" className="ai-focus-section">
      <div className="ai-focus-container">
        <div className="ai-focus-copy">
          <h1 className="section-title ai-focus-title">
            <span>{aiPositioning.section_name}</span>
          </h1>
          <h2>{aiPositioning.headline}</h2>
          <p>{aiPositioning.summary}</p>
        </div>
        <div className="ai-focus-panel">
          <ul className="ai-focus-list">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="ai-keyword-list" aria-label="AI focus keywords">
            {keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFocus;
