import { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { codeTemplates } from "../../constant/codeTemplates";
import { monacoLang } from "../../constant/monacoLang";
import LangSelect from "./LangSelect";

export default function CodeEditor({ lang, setLang, codes, setCodes }) {
  const editorRef = useRef();
  const code = codes[lang] ?? "";

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7923/ingest/fc6430b9-550d-4040-b155-bf0d82b0c2ab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "96ab71",
      },
      body: JSON.stringify({
        sessionId: "96ab71",
        location: "CodeEditor.jsx:lang-effect",
        message: "lang or code changed",
        data: {
          lang,
          codeLen: code.length,
          codePreview: code.slice(0, 40),
          allLangKeys: Object.keys(codes),
        },
        timestamp: Date.now(),
        hypothesisId: "C",
      }),
    }).catch(() => {});
  }, [lang, code]);
  // #endregion

  const onMount = (editor) => {
    editorRef.current = editor;
  };

  function handleReset() {
    // #region agent log
    fetch("http://127.0.0.1:7923/ingest/fc6430b9-550d-4040-b155-bf0d82b0c2ab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "96ab71",
      },
      body: JSON.stringify({
        sessionId: "96ab71",
        location: "CodeEditor.jsx:handleReset",
        message: "reset clicked",
        data: {
          lang,
          staleCodesKeys: Object.keys(codes),
          staleCodeLen: (codes[lang] ?? "").length,
        },
        timestamp: Date.now(),
        hypothesisId: "E",
      }),
    }).catch(() => {});
    // #endregion
    setCodes((prev) => ({
      ...prev,
      [lang]: codeTemplates[lang],
    }));
  }

  return (
    <div className="editor-wrap">
      <div className="code-header">
        <span className="code-header__title">Code</span>
        <span className="code-header__spacer" />
        <div className="code-header__actions">
          <LangSelect lang={lang} setLang={setLang} />
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
          onChange={(value) => {
            // #region agent log
            const staleSnapshot = codes[lang] ?? "";
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
                  location: "CodeEditor.jsx:onChange",
                  message: "editor onChange",
                  data: {
                    lang,
                    newLen: (value ?? "").length,
                    staleLen: staleSnapshot.length,
                    newPreview: (value ?? "").slice(-20),
                    stalePreview: staleSnapshot.slice(-20),
                    codesRefKeys: Object.keys(codes),
                  },
                  timestamp: Date.now(),
                  hypothesisId: "B",
                }),
              },
            ).catch(() => {});
            // #endregion
            setCodes((prev) => ({ ...prev, [lang]: value ?? "" }));
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
