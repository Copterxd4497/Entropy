import express from "express";
import {
  createScratchProblem,
  createScratchProblemTopics,
  getScratchProblems,
  getScratchProblemTopics,
  scratchProblem,
  updateScratchProblemStatus,
} from "../controllers/scratchProblemController.js";

const router = express.Router();

router.post("/createScratchProblem", createScratchProblem);
router.post("/createScratchProblemTopics", createScratchProblemTopics);
router.get("/getScratchProblems", getScratchProblems);
router.get("/getScratchProblemTopics", getScratchProblemTopics);
router.get("/:id", scratchProblem);
router.patch("/:id/status", updateScratchProblemStatus);

export default router;
