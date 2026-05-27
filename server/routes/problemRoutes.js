import express from "express";

import {
  createProblem,
  getProblems,
} from "../controllers/problemController.js";

const router = express.Router();

router.post("/createProblem", createProblem);
router.get("/getProblems", getProblems);

export default router;
