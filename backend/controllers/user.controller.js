import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/* ---------- REGISTER ---------- */
export const register = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;

    if (!name || !email || !password || !userName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- LOGIN ---------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- UPLOAD PROFILE PICTURE ---------- */
export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findOne({ token });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(201).json({
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- UPDATE USER (NAME / EMAIL / USERNAME) ---------- */
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newData } = req.body;

    const user = await User.findOne({ token });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    Object.assign(user, newData);
    await user.save();

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- GET LOGGED IN USER PROFILE ---------- */
export const getUserProfile = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email userName profilePicture"
    );

    return res.status(200).json({ userProfile: profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- UPDATE PROFILE DATA (STEP 4) ---------- */
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...profileData } = req.body;

    const user = await User.findOne({ token });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    Object.assign(profile, profileData);
    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- GET ALL USERS ---------- */
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email userName profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- DOWNLOAD PROFILE (PDF) ---------- */
export const downloadProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const profile = await Profile.findOne({ userId }).populate(
      "userId",
      "name email userName"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const doc = new PDFDocument();
    const fileName = `${profile.userId.userName}-resume.pdf`;
    const filePath = path.join("uploads", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("User Resume", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${profile.userId.name}`);
    doc.text(`Email: ${profile.userId.email}`);
    doc.moveDown();

    doc.text(`Bio: ${profile.bio || ""}`);
    doc.text(`Current Position: ${profile.currentPost || ""}`);

    doc.end();

    return res.status(200).json({
      message: "Resume generated",
      file: filePath,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
