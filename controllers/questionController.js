import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const askQuestion = async (req, res) => {
  const { title, question, token } = req.body;

  try {
    if (!token || !title || !question) {
      return res.status(400).json({
        message:
          "either the token, title or question is missing from the provided information",
      });
    }

    if (title.length > 255) {
      return res
        .status(400)
        .json({ message: "the title can not be more than 255 chars" });
    }

    if (question.length > 5000) {
      return res
        .status(400)
        .json({ message: "maximum question character limit passed" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decode.userId;

    const cleanTitle = title.trim();
    const cleanQuestion = question.trim();

    await db.execute(
      "INSERT INTO questions(user_id, title, question) VALUES (?,?,?)",
      [userId, cleanTitle, cleanQuestion],
    );
    res
      .status(201)
      .json({ message: "question sumbitted sueccessfully sucessfull" });
  } catch (err) {
    console.log(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "UNAUTORIZED USER" });
    }
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
