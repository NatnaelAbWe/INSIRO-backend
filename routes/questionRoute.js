import express from "express";
import { askQuestion } from "../controllers/questionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { rateLimit } from "express-rate-limit";
import { getAllQuestions } from "../controllers/questionController.js";
import { fetchSpacificQuestion } from "../controllers/questionController.js";

const questionLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 2,
  message: "daily question ask limit reached",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 48,
});

const router = express.Router();

router.post("/ask", authMiddleware, questionLimiter, askQuestion);
router.get("/all", getAllQuestions);
router.get("/:questionId", fetchSpacificQuestion);

export default router;
