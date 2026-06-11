import ScratchProblem from "../models/scratchProblemModel.js";
import ScratchProblemTopics from "../models/scratchProblemTopicModel.js";

export const createScratchProblem = async (req, res) => {
  try {
    const scratchProblem = await ScratchProblem.create(req.body);
    res.status(201).json(scratchProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createScratchProblemTopics = async (req, res) => {
  try {
    const scratchProblemTopic = await ScratchProblemTopics.create(req.body);
    res.status(201).json(scratchProblemTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScratchProblems = async (req, res) => {
  try {
    const scratchProblems = await ScratchProblem.find();
    res.json(scratchProblems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScratchProblemTopics = async (req, res) => {
  try {
    const scratchProblemTopics = await ScratchProblemTopics.find();
    res.json(scratchProblemTopics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scratchProblem = async (req, res) => {
  try {
    const id = req.params.id;
    const isNumeric = !isNaN(id);

    let scratchProblem;
    if (isNumeric) {
      scratchProblem = await ScratchProblem.findOne({ id: parseInt(id, 10) });
    } else {
      scratchProblem = await ScratchProblem.findById(id);
    }

    if (!scratchProblem) {
      return res.status(404).json({ message: "Scratch problem not found" });
    }

    res.json(scratchProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateScratchProblemStatus = async (req, res) => {
  const { status } = req.body;
  const solved = status === "solved";
  const id = req.params.id;
  const isNumeric = !isNaN(id);

  try {
    let updatedScratchProblem;
    if (isNumeric) {
      updatedScratchProblem = await ScratchProblem.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { status, solved },
        { new: true },
      );
      await ScratchProblemTopics.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { solved },
      );
    } else {
      updatedScratchProblem = await ScratchProblem.findByIdAndUpdate(
        id,
        { status, solved },
        { new: true },
      );
      await ScratchProblemTopics.findByIdAndUpdate(id, { solved });
    }

    if (!updatedScratchProblem) {
      return res.status(404).json({ message: "Scratch problem not found" });
    }

    res.json({ success: true, scratchProblem: updatedScratchProblem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
