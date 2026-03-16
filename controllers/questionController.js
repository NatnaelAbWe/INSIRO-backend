import { db } from "../config/db.js";

export const askQuestion = async (req, res) => {
  const { title, question } = req.body;

  try {
    if (!title || !question) {
      return res.status(400).json({
        message:
          "either the title or question is missing from the provided information",
      });
    }

    const cleanTitle = title.trim();
    const cleanQuestion = question.trim();

    if (cleanTitle.length > 255) {
      return res
        .status(400)
        .json({ message: "the title can not be more than 255 chars" });
    }

    if (cleanTitle.length == 0) {
      return res
        .status(400)
        .json({ message: "TITLE CAN NOT BE EMPTY AFTER TRIMMING" });
    }

    if (cleanQuestion.length > 5000) {
      return res
        .status(400)
        .json({ message: "maximum question character limit passed" });
    }

    if (cleanQuestion.length == 0) {
      return res
        .status(200)
        .json({ message: "QUESTION CAN NOT BE EMPTY AFTER TRIMMING" });
    }

    const userId = req.user.userId;

    await db.execute(
      "INSERT INTO questions(user_id, title, question) VALUES (?,?,?)",
      [userId, cleanTitle, cleanQuestion],
    );
    res.status(201).json({ message: "Question sumbitted sueccessfully" });
  } catch (err) {
    console.log("AskQuestion Error: ", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
