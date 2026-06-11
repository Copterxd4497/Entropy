//The CodeEditor component
//be responsible since "Code" at the left-up side to the reset button

import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import "../../../styles/code-editor.css";
import { codeTemplates } from "../../constant/codeTemplates";
import { monacoLang } from "../../constant/monacoLang";
import LangSelect from "./LangSelect";

export default function CodeEditor({ lang, setLang, codes, setCodes }) {
  const editorRef = useRef();
  const code = codes[lang] ?? "";

  const onMount = (editor) => {
    editorRef.current = editor;
  };

  // Reset Button
  function handleReset() {
    setCodes((prev) => ({
      ...prev,
      [lang]: codeTemplates[lang],
    }));
  }

  return (
    <div className="editor-wrap">
      {/* UI Header */}
      <div className="code-header">
        <span className="code-header__title">Code</span>
        <span className="code-header__spacer" />
        <div className="code-header__actions">
          {/* Language Selector */}
          <LangSelect lang={lang} setLang={setLang} />

          {/* Reset Button */}
          <button
            type="button"
            className="code-header__btn"
            onClick={handleReset}
            title="Reset code"
          >
            ↺
          </button>
        </div>
      </div>

      <div className="editor-area" style={{ flex: 1, minHeight: 0 }}>
        <Editor
          key={lang}
          theme="vs-dark"
          language={monacoLang[lang] ?? "javascript"}
          value={code}
          //keep the code
          //The onChange prop is what keeps the user's code synchronized with React state.
          onChange={(value) => {
            setCodes((prev) => ({
              ...prev,
              [lang]: value ?? "",
            }));
          }}
          onMount={onMount}
          height="100%"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "JetBrains Mono, monospace",
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
