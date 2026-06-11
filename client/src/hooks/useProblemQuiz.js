import { useState, useEffect } from "react";

export function useProblemQuiz(problemQuizId) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!problemId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/problems//Quiz/${problemQuizId}`)
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
  }, [problemId]);

  return { problem, loading, error };
}
