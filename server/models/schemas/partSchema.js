import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    text: String,
    math: Boolean,
    code: Boolean,
    bold: Boolean,
    italic: Boolean,
  },
  { _id: false },
);

export default partSchema;
