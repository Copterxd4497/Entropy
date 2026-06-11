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

//make the problemTopics link the the real problem
export const problem = async (req, res) => {
  try {
    // Handle both numeric IDs and MongoDB ObjectIds
    const id = req.params.id;
    const isNumeric = !isNaN(id);

    let problem;
    if (isNumeric) {
      // Search by numeric id field
      problem = await Problem.findOne({ id: parseInt(id) });
    } else {
      // Search by MongoDB ObjectId
      problem = await Problem.findById(id);
    }

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//make the problemTopics link the the real problem
export const problemQuiz = async (req, res) => {
  try {
    // Handle both numeric IDs and MongoDB ObjectIds
    const id = req.params.id;
    const isNumeric = !isNaN(id);

    let problem;
    if (isNumeric) {
      // Search by numeric id field
      problem = await Problem.findOne({ id: parseInt(id) });
    } else {
      // Search by MongoDB ObjectId
      problem = await Problem.findById(id);
    }

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Checking if problem were solved
export const updateProblemStatus = async (req, res) => {
  const { status } = req.body;
  const solved = status === "solved";

  const id = req.params.id;
  const isNumeric = !isNaN(id);

  try {
    let updatedProblem;
    if (isNumeric) {
      updatedProblem = await Problem.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { status, solved },
        { new: true },
      );
      await ProblemTopics.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { solved },
      );
    } else {
      updatedProblem = await Problem.findByIdAndUpdate(
        id,
        { status, solved },
        { new: true },
      );
      await ProblemTopics.findByIdAndUpdate(id, { solved });
    }

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ success: true, problem: updatedProblem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
