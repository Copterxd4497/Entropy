import mongoose from "mongoose";

import descriptionSchema from "./schemas/descriptionSchema.js";
import exampleSchema from "./schemas/exampleSchema.js";
import testCaseSchema from "./schemas/testCaseSchema.js";

const scratchProblemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  likes: String,
  dislikes: String,
  online: Number,
  tags: [String],
  companies: [String],
  description: [descriptionSchema],
  examples: [exampleSchema],
  constraints: [String],
  testCases: [testCaseSchema],
});

const ScratchProblem = mongoose.model(
  "ScratchProblem",
  scratchProblemSchema,
  "scratchProblems",
);

export default ScratchProblem;
