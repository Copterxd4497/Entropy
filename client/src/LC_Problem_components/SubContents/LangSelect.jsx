import { languages } from "../../constant/codeTemplates";

export default function LangSelect({ lang, setLang }) {
  return (
    <select
      value={lang}
      onChange={(e) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7923/ingest/fc6430b9-550d-4040-b155-bf0d82b0c2ab",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "96ab71",
            },
            body: JSON.stringify({
              sessionId: "96ab71",
              location: "LangSelect.jsx:onChange",
              message: "language switched",
              data: { from: lang, to: e.target.value },
              timestamp: Date.now(),
              hypothesisId: "C",
            }),
          },
        ).catch(() => {});
        // #endregion
        setLang(e.target.value);
      }}
      className="lang-select"
    >
      {languages.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
