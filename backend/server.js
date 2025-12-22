import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import postsRoutes from "./routes/posts.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 9090;

/* 🔥 MONGODB CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* ROUTES */
app.use("/", postsRoutes);
app.use("/", userRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
