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

//problem
router.get("/:id", problem);
router.get("/Quiz/:id", problemQuiz);

//Checking Status
router.patch("/:id/status", updateProblemStatus);

export default router;
