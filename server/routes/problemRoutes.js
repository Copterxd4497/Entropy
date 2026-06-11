import express from "express";

import {
  createProblem,
  createProblemTopics,
  getProblems,
  getProblemTopics,
  problem,
  problemQuiz,
  updateProblemStatus,
} from "../controllers/problemController.js";

const router = express.Router();

router.post("/createProblem", createProblem);
router.post("/createProblemTopics", createProblemTopics);

router.get("/getProblems", getProblems);
router.get("/getProblemTopics", getProblemTopics);

// Put specific routes first
router.get("/Quiz/:id", problemQuiz);
router.get("/:id", problem);

// Checking Status
router.patch("/:id/status", updateProblemStatus);

export default router;
