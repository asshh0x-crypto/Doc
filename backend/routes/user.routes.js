import { Router } from "express";
import { register } from "../controllers/user.controller.js";

const router = Router();

// ❌ GET ❌
// router.route('/register').get(register);

// ✅ POST
router.post("/register", register);

export default router;
