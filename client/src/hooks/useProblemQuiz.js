import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function useProblemQuiz(problemQuizId) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!problemQuizId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    apiFetch(`/api/problems/Quiz/${problemQuizId}`)
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
  }, [problemQuizId]);

  return { problem, loading, error };
}
