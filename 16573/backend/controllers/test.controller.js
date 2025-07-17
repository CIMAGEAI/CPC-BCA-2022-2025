import { Test } from "../models/test.model.js";

// CREATE
export const createTest = async (req, res) => {
  try {
    const { title, description, testLink, accessCode } = req.body;

    if (!title || !testLink || !accessCode) {
      return res.status(400).json({ errors: "Title, link, and access code are required" });
    }

    const newTest = await Test.create({
      title,
      description,
      testLink,
      accessCode
    });

    res.status(201).json({ success: true, message: "Test created successfully", data: newTest });
  } catch (error) {
    console.error("Error creating test", error);
    res.status(500).json({ errors: "Server error while creating test" });
  }
};

// GET ALL
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Error getting tests", error);
    res.status(500).json({ errors: "Server error while fetching tests" });
  }
};

// DELETE
export const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findByIdAndDelete(testId);
    if (!test) {
      return res.status(404).json({ errors: "Test not found" });
    }

    res.status(200).json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test", error);
    res.status(500).json({ errors: "Server error while deleting test" });
  }
};
