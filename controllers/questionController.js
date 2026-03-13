import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const askQuestion = async (req, res) => {
  const { title, question, userId, token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "token missing" });
    }

    if (title.length > 255) {
      return res
        .status(400)
        .json({ message: "the title can not be more than 255 chars" });
    }

    await db.execute(
      "INSERT INTO questions(user_id, title, question) VALUES (?,?,?)",
      [userId, title, question],
    );
    res.status(200).json({ message: "opration sucessfull" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
