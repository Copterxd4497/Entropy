//import Problem data
import Problem from "../models/problemModel.js";
import ProblemTopics from "../models/problemTopicModel.js";

//import Scratch data
import ScratchProblem from "../models/scratchProblemModel.js";
import ScratchProblemTopics from "../models/scratchProblemTopicModel.js";

export const all_problems = async (req, res) => {
  try {
    const scratchProblem = await ScratchProblem.find();
    const problem = await Problem.find();

    res.json([...scratchProblem, ...problem]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const all_problemTopics = async (req, res) => {
  try {
    const problemTopics = await ProblemTopics.find();
    const scratchTopics = await ScratchProblemTopics.find().populate(
      "scratchProblem",
    );

    res.json([
      ...problemTopics.map((topic) => ({
        ...topic.toObject(),
        type: "problem",
      })),

      ...scratchTopics.map((topic) => ({
        ...topic.toObject(),
        type: "scratch",
      })),
    ]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
