import mongoose from "mongoose";
import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "/.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connect fail: " + err);
  });

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
