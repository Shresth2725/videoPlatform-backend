import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // to get the json data in app
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to get the url data in app

app.use(express.static("public")); // it is a public assest to temporarily store a file or data

app.use(cookieParser()); // to handle protected cookie which can be only used by BE

export { app };

// we use multer to get file data in app - multer is a library
