import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    expected: String,
  },
  { _id: false },
);

export default testCaseSchema;
