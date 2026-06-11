import express from "express";
import cors from "cors";

import problemRoutes from "./routes/problemRoutes.js";
import scratchProblemRoutes from "./routes/scratchProblemRoutes.js";
import allProblemRoutes from "./routes/all-problemRoutes.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/problems", problemRoutes);
app.use("/api/scratchProblems", scratchProblemRoutes);
app.use("/api/all-problems", allProblemRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello World" });
});

export default app;
