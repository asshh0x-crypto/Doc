import { Router } from "express";
import multer from "multer";

import {
  login,
  register,
  uploadProfilePicture,
  updateUserProfile,
  getUserProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile
} from "../controllers/user.controller.js";

const router = Router();

/* ---------- MULTER CONFIG ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

/* ---------- ROUTES ---------- */

// auth
router.post("/register", register);
router.post("/login", login);

// profile
router.post(
  "/update_profile_picture",
  uploads.single("profile_picture"),
  uploadProfilePicture
);

router.post("/user_update", updateUserProfile);
router.post("/get_user_and_profile", getUserProfile);
router.post("/update_profile_data", updateProfileData);

// admin / listing
router.get("/get_all_users", getAllUserProfile);

// download
router.get("/download_resume", downloadProfile);

export default router;
