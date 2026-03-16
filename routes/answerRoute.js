import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { postanswer } from "../controllers/answerController.js";
import { getAnswersForQuestion } from "../controllers/answerController.js";
import { editAnswer } from "../controllers/answerController.js";
import { deleteAnswer } from "../controllers/answerController.js";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

const answerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 2,
  message: "daily question ask limit reached",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 48,
});

router.post(
  "/post-answer/:questionId",
  authMiddleware,
  answerLimiter,
  postanswer,
);
router.get("/all-answers/:questionId", getAnswersForQuestion);
router.patch("/edit-answer/:answerId", authMiddleware, editAnswer);
router.delete("/delete-answer/:answerId", authMiddleware, deleteAnswer);

export default router;
