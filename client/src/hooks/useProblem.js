import { useState, useEffect } from "react";

export function useProblem(type, problemId) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type || !problemId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const normalizedType =
      type === "code" ? "problem" : type === "canvas" ? "scratch" : type;

    const basePath =
      normalizedType === "scratch" ? "/api/scratchProblems" : "/api/problems";

    fetch(`${basePath}/${problemId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Problem not found (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setProblem(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProblem(null);
      })
      .finally(() => setLoading(false));
  }, [type, problemId]);

  return { problem, loading, error, setProblem };
}
