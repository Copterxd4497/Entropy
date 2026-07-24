import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/subject-page.css";

const levels = [
  {
    id: "beginner",
    title: "Just getting started",
    detail: "I am new to this subject or want to rebuild the basics.",
  },
  {
    id: "intermediate",
    title: "I know the fundamentals",
    detail: "I can solve familiar problems and want more of a challenge.",
  },
  {
    id: "advanced",
    title: "Ready to push further",
    detail: "I am comfortable with the basics and want advanced practice.",
  },
];

export default function CurrentLevelPage() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("beginner");

  const handleContinue = () => {
    localStorage.setItem("currentLevel", level);
    navigate("/intro/daily-learning");
  };

  return (
    <main className="subject-page">
      <header className="subject-page__header">
        <button className="subject-page__back" type="button" aria-label="Go back" onClick={() => navigate("/subjects")}>←</button>
        <div className="subject-page__brand"><span className="subject-page__brand-mark">&lt;/&gt;</span>Entropy</div>
        <div className="subject-page__progress" aria-label="Step 2 of 3">
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
          <span className="subject-page__progress-segment" />
        </div>
        <span className="subject-page__step">02 / 03</span>
      </header>

      <section className="subject-page__content onboarding-form" aria-labelledby="level-title">
        <p className="subject-page__eyebrow">MAKE IT YOURS</p>
        <h1 id="level-title">Where are you starting from?</h1>
        <p className="subject-page__intro">We will use this to choose a comfortable first set of problems for you.</p>
        <div className="onboarding-options" role="radiogroup" aria-label="Current skill level">
          {levels.map((option) => (
            <button key={option.id} type="button" role="radio" aria-checked={level === option.id} className={`onboarding-option${level === option.id ? " onboarding-option--selected" : ""}`} onClick={() => setLevel(option.id)}>
              <span className="onboarding-option__radio" aria-hidden="true" />
              <span><strong>{option.title}</strong><small>{option.detail}</small></span>
            </button>
          ))}
        </div>
      </section>

      <footer className="subject-page__footer"><button className="subject-page__continue" type="button" onClick={handleContinue}>Continue <span aria-hidden="true">→</span></button></footer>
    </main>
  );
}
