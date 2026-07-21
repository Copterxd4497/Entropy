import mongoose from "mongoose";

const scratchProblemTopicsSchema = new mongoose.Schema(
  {
    // This is the ScratchProblem.id that this topic summary represents.
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
          "Algebra",
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// The two collections use the same numeric ID. A virtual keeps that link
// without duplicating MongoDB's _id in existing topic documents.
scratchProblemTopicsSchema.virtual("scratchProblem", {
  ref: "ScratchProblem",
  localField: "id",
  foreignField: "id",
  justOne: true,
});

const ScratchProblemTopics = mongoose.model(
  "ScratchProblemTopics",
  scratchProblemTopicsSchema,
  "scratchProblemTopics",
);

export default ScratchProblemTopics;
