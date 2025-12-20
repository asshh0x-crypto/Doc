import { Router } from "express";
import {
  login,
  register,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

router.post(
  "/update_profile_picture",
  uploads.single("profile_picture"),
  uploadProfilePicture
);

router.post("/register", register);
router.post("/login", login);

export default router;
