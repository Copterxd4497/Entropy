import express from "express";

import {
  createProblem,
  createProblemTopics,
  getProblems,
  getProblemTopics,
  problem,
} from "../controllers/problemController.js";

const router = express.Router();

router.post("/createProblem", createProblem);
router.post("/createProblemTopics", createProblemTopics);
router.get("/getProblems", getProblems);
router.get("/getProblemTopics", getProblemTopics);
router.get("/:id", problem);

export default router;
