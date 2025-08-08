import mongoose from "mongoose";
import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "/.env" });

connectDB();

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on("error", (e) => {
//       console.log("ERROR: " + e);
//       throw e;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App listening on port ${process.env.PORT}`);
//     });
//   } catch (err) {
//     console.error("ERROR: " + err.message);
//     throw err;
//   }
// })();
