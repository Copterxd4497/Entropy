import mongoose from "mongoose";

import descriptionSchema from "./schemas/descriptionSchema.js";
import exampleSchema from "./schemas/exampleSchema.js";
import testCaseSchema from "./schemas/testCaseSchema.js";

const problemSchema = new mongoose.Schema({
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

  solved: Boolean,

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

const Problem = mongoose.model("Problem", problemSchema, "problems");

export default Problem;
