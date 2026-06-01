import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },

  topics: [String],

  description: {
    type: String,
    required: true,
  },

  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],

  constraints: [String],

  starterCode: {
    javascript: String,
    python: String,
    java: String,
  },

  testCases: [
    {
      input: mongoose.Schema.Types.Mixed,
      expectedOutput: mongoose.Schema.Types.Mixed,
    },
  ],

  solution: {
    type: String,
  },

  explanation: {
    type: String,
  },

  order: Number,

  acceptanceRate: Number,
});

const Problem = mongoose.model("Problem", problemSchema, "myDatabase");

export default Problem;
