import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/subject-page.css";

const learningGoals = [
  { id: "10", minutes: "10 min", label: "A quick daily warm-up" },
  { id: "20", minutes: "20 min", label: "A focused practice session" },
  { id: "30", minutes: "30 min", label: "A deeper daily challenge" },
];

export default function DailyLearningPage() {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState("20");

  const handleFinish = () => {
    localStorage.setItem("dailyLearningGoal", dailyGoal);
    localStorage.setItem("onboardingComplete", "true");
    navigate("/");
  };

  return (
    <main className="subject-page">
      <header className="subject-page__header">
        <button className="subject-page__back" type="button" aria-label="Go back" onClick={() => navigate("/intro/current-level")}>←</button>
        <div className="subject-page__brand"><span className="subject-page__brand-mark">&lt;/&gt;</span>Entropy</div>
        <div className="subject-page__progress" aria-label="Step 3 of 3">
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
          <span className="subject-page__progress-segment subject-page__progress-segment--active" />
        </div>
        <span className="subject-page__step">03 / 03</span>
      </header>

      <section className="subject-page__content onboarding-form" aria-labelledby="daily-title">
        <p className="subject-page__eyebrow">BUILD A HABIT</p>
        <h1 id="daily-title">How much time can you spend each day?</h1>
        <p className="subject-page__intro">Small, consistent sessions create real momentum. You can change this anytime.</p>
        <div className="onboarding-options" role="radiogroup" aria-label="Daily learning goal">
          {learningGoals.map((goal) => (
            <button key={goal.id} type="button" role="radio" aria-checked={dailyGoal === goal.id} className={`onboarding-option${dailyGoal === goal.id ? " onboarding-option--selected" : ""}`} onClick={() => setDailyGoal(goal.id)}>
              <span className="onboarding-option__radio" aria-hidden="true" />
              <span><strong>{goal.minutes} a day</strong><small>{goal.label}</small></span>
            </button>
          ))}
        </div>
      </section>

      <footer className="subject-page__footer"><button className="subject-page__continue" type="button" onClick={handleFinish}>Start learning <span aria-hidden="true">→</span></button></footer>
    </main>
  );
}
