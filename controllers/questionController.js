import { db } from "../config/db.js";

export const askQuestion = async (req, res) => {
  const { title, question } = req.body;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM questions WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 DAY",
      [userId],
    );

    if (rows[0].count > 2) {
      return res.status(429).json({
        message: "you have reached the daily limit of 2 questions per account",
      });
    }

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

export const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await db.execute(`SELECT 
    questions.id, 
    questions.title, 
    questions.question, 
    user.username 
FROM questions 
INNER JOIN user ON questions.user_id = user.id ORDER BY questions.id DESC`);

    return res
      .status(200)
      .json({ message: "questions sucessfully retritrived", data: questions });
  } catch (error) {
    console.error("error from getAlllQuestions: ", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const fetchSpacificQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const [questionWithId] = await db.execute(
      `SELECT * FROM questions INNER JOIN user ON questions.user_id = user.id WHERE questions.id = ?`,
      [questionId],
    );

    if (questionId.length === 0) {
      return res
        .status(400)
        .json({ message: "NO QUESTION FOUND WITH THIS ID" });
    }

    return res.status(200).json({
      message: "question retrived sucessfully",
      question: questionWithId,
    });
  } catch (err) {
    console.error("error from the fetch spacific question: ", err);
    return res.status(500).json({ message: "INTERNAL SEVER ERROR" });
  }
};
