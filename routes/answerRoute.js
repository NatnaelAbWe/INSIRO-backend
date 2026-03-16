import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { postanswer } from "../controllers/answerController.js";

const router = express.Router();

router.post("/post-answer/:questionId", authMiddleware, postanswer);

export default router;
