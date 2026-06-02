import mongoose from "mongoose";
import partSchema from "./partSchema.js";

const descriptionSchema = new mongoose.Schema(
  {
    type: String,
    parts: [partSchema],
  },
  { _id: false },
);

export default descriptionSchema;
