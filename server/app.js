import express from "express";
import cors from "cors";

import problemRoutes from "./routes/problemRoutes.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/problems", problemRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello World" });
});

export default app;
