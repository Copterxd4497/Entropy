import mongoose from "mongoose";

const ProblemTopicsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
    unique: true,
  },

  acceptance: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },

  solved: {
    type: Boolean,
    default: false,
  },

  tags: [
    {
      type: String,
      enum: [
        "Array",
        "String",
        "Hash Table",
        "Math",
        "Dynamic Programming",
        "Sorting",
        "Greedy",
        "Binary Search",
        "Depth-First Search",
        "Linked List",
        "Sliding Window",
        "DP",
      ],
    },
  ],
});

const ProblemTopics = mongoose.model(
  "ProblemTopics",
  ProblemTopicsSchema,
  "problemTopics",
);

export default ProblemTopics;
