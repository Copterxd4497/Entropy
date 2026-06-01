import { useState, useCallback } from "react";
import "../styles/lc-problemStyle.css";

import Toolbar from "../LC_Problem_components/MainContents/Toolbar";
import DescriptionPanel from "../LC_Problem_components/MainContents/DescriptionPanel";
import RightPanel from "../LC_Problem_components/MainContents/RightPanel";
import { useResizable } from "../hooks/useResizable";

import { codeTemplates } from "../constant/codeTemplates";
import { problems } from "../LC_Problem_data/problemsData";

import { executeConsole, executeCode } from "../utils/runCode";

export default function LC_Problem() {
  const [leftPct, onDividerMouseDown] = useResizable(36, 20, 50);
  const [lang, setLang] = useState("Python");
  const [codes, setCodes] = useState(codeTemplates);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setIsRunning(true);

    try {
      const result = await executeConsole(lang, codes[lang]);

      setOutput(result);
    } catch (err) {
      setOutput({
        output: err.message,
        error: err.message,
      });
    } finally {
      setIsRunning(false);
    }
  }, [lang, codes]);

  const handleSubmit = useCallback(async () => {
    setIsRunning(true);

    try {
      const result = await executeCode(lang, codes[lang], problems[testCases]);

      setOutput(result);
    } catch (err) {
      setOutput([
        {
          pass: false,
          output: err.message,
          error: err.message,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [lang, codes]);

  return (
    <div className="app">
      <Toolbar
        onRun={handleRun}
        onSubmit={handleSubmit}
        isRunning={isRunning}
      />

      <div className="body">
        <div
          style={{
            flex: `0 0 ${leftPct}%`,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <DescriptionPanel />
        </div>

        <div className="divider" onMouseDown={onDividerMouseDown} />

        <RightPanel
          output={output}
          lang={lang}
          setLang={setLang}
          codes={codes}
          setCodes={setCodes}
        />
      </div>
    </div>
  );
}
