//This component displays a language dropdown and updates the application's current programming language whenever the user selects a different option.

import { languages } from "../../constant/codeTemplates";

export default function LangSelect({ lang, setLang }) {
  return (
    <select
      value={lang}
      onChange={(e) => {
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
