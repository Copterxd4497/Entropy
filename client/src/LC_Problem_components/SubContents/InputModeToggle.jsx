export default function InputModeToggle({ mode, setMode }) {
  return (
    <div className="input-mode-toggle" role="group" aria-label="Input source">
      <button
        type="button"
        className={`input-mode-toggle__btn${mode === "original" ? " input-mode-toggle__btn--active" : ""}`}
        onClick={() => setMode("original")}
      >
        Original
      </button>
      <button
        type="button"
        className={`input-mode-toggle__btn${mode === "custom" ? " input-mode-toggle__btn--active" : ""}`}
        onClick={() => setMode("custom")}
      >
        My Input
      </button>
    </div>
  );
}
