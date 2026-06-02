import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import app from "./app.js";

const DB = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.MONGO_URI_PASSWORD,
);

mongoose
  .connect(DB, {
    dbName: "myDatabase",
  })
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
