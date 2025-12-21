import { Router } from "express";
import multer from "multer";
import {
  login,
  register,
  uploadProfilePicture,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

/* multer config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

/* routes */
router.post("/register", register);
router.post("/login", login);
router.post("/get_user_and_profile", getUserProfile);
router.post("/user_update", updateUserProfile);

router.post(
  "/update_profile_picture",
  uploads.single("profile_picture"),
  uploadProfilePicture
);

export default router;
