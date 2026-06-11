import express from "express";

import {
  all_problems,
  all_problemTopics,
} from "../controllers/all-problemController.js";

const router = express.Router();

router.get("/get_all-problems", all_problems);
router.get("/get_all-problemTopics", all_problemTopics);

export default router;
