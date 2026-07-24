import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/subject-page.css";

const subjects = [
  {
    id: "math",
    name: "Math",
    description: "Build intuition with visual, step-by-step practice.",
    icon: "∑",
    className: "subject-card--math",
  },
  {
    id: "programming",
    name: "Programming",
    description: "Practice patterns and sharpen your problem-solving skills.",
    icon: "</>",
    className: "subject-card--programming",
  },
];

export default function SubjectPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("math");

  const handleContinue = () => {
    localStorage.setItem("preferredSubject", selectedSubject);
    navigate("/intro/current-level");
  };

  return (
    <main className="subject-page">
      <header className="subject-page__header">
        <button
          className="subject-page__back"
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <div className="subject-page__brand">
          <span className="subject-page__brand-mark">&lt;/&gt;</span>
          Entropy
        </div>
        <div className="subject-page__progress" aria-label="Step 1 of 3">
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
          <span className="subject-page__progress-segment" />
          <span className="subject-page__progress-segment" />
        </div>
        <span className="subject-page__step">01 / 03</span>
      </header>

      <section className="subject-page__content" aria-labelledby="subject-title">
        <p className="subject-page__eyebrow">PERSONALIZE YOUR PRACTICE</p>
        <h1 id="subject-title">What would you like to learn first?</h1>
        <p className="subject-page__intro">
          Pick a starting point. You can explore every subject whenever you
          want.
        </p>

        <div className="subject-page__cards" role="radiogroup" aria-label="Subjects">
          {subjects.map((subject) => {
            const isSelected = selectedSubject === subject.id;

            return (
              <button
                key={subject.id}
                className={`subject-card ${subject.className}${isSelected ? " subject-card--selected" : ""}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <span className="subject-card__glow" />
                <span className="subject-card__icon" aria-hidden="true">
                  {subject.icon}
                </span>
                <span className="subject-card__name">{subject.name}</span>
                <span className="subject-card__description">{subject.description}</span>
                <span className="subject-card__select-indicator" aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="subject-page__footer">
        <button className="subject-page__continue" type="button" onClick={handleContinue}>
          Continue <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  );
}
