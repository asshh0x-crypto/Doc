import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // ✅ ROUTES SE PEHLE

app.use("/api", postsRoutes);
app.use("/api", userRoutes);

const start = async () => {
  await mongoose.connect(
    "mongodb+srv://eboouser:F7nmKPd4fiJEfK2i@getjobs.mwbb653.mongodb.net/?appName=getjobs"
  );

  app.listen(9080, () => {
    console.log("🚀 Server is running on port 9080");
  });
};

start();
