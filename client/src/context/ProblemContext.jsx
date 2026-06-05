import { createContext, useContext } from "react";

const ProblemContext = createContext(null);

export function ProblemProvider({ children, problem, loading, error }) {
  const value = { problem, loading, error };

  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  );
}

export function useProblemContext() {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error("useProblemContext must be used within a ProblemProvider");
  }
  return context;
}
