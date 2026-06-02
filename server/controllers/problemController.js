import Problem from "../models/problemModel.js";
import ProblemTopics from "../models/problemTopicModel.js";

export const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createProblemTopics = async (req, res) => {
  try {
    const problemTopic = await ProblemTopics.create(req.body);

    res.status(201).json(problemTopic);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();

    res.json(problems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProblemTopics = async (req, res) => {
  try {
    const problemTopics = await ProblemTopics.find();

    res.json(problemTopics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
