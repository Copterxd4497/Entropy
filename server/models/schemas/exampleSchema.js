import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    id: Number,
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false },
);

export default exampleSchema;
