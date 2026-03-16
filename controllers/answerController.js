import { db } from "../config/db.js";

export const postanswer = async (req, res) => {
  const { answer } = req.body;
  const { questionId } = req.params;
  const userId = req.user.userId;
  const vote = 0;

  try {
    if (!answer) {
      return res.status(400).json({
        message: "NO ANSWER PROVIDED Pls TRY TO ANSWER SOME OF THE QUESTION",
      });
    }

    const correctedAnswer = answer.trim();

    if (correctedAnswer.length === 0) {
      return res
        .status(400)
        .json({ message: "EMPTY ANSWER CAN NOT BE SUMBITTED" });
    }

    const [rows] = await db.execute("SELECT * FROM questions WHERE id= ?", [
      questionId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "a question with the id provided does not exist" });
    }

    await db.execute(
      "INSERT INTO answers (question_id,user_id,answer,vote) VALUES (?,?,?,?)",
      [questionId, userId, answer, vote],
    );

    return res.status(200).json({ message: "ANSWER SUMBITTED SUCESSFULLY" });
  } catch (error) {
    console.log("ERROR FROM THE POSTANSWER: ", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const getAnswersForQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const [answers] = await db.execute(
      `SELECT 
        answers.id, 
        answers.answer, 
        answers.vote,
        answers.created_at, 
        user.username 
       FROM answers 
       INNER JOIN user ON answers.user_id = user.id 
       WHERE answers.question_id = ? 
       ORDER BY answers.id DESC`,
      [questionId],
    );
    return res.status(200).json({
      message: "Answers retrieved successfully",
      data: answers,
    });
  } catch (error) {
    console.error("Error in getAnswersForQuestion: ", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const editAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { answer } = req.body;
  const userId = req.user.userId;

  try {
    if (!answer || answer.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "New answer content cannot be empty" });
    }

    const [rows] = await db.execute(
      "SELECT user_id FROM answers WHERE id = ?",
      [answerId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this answer" });
    }

    await db.execute("UPDATE answers SET answer = ? WHERE id = ?", [
      answer.trim(),
      answerId,
    ]);

    return res.status(200).json({ message: "Answer updated successfully" });
  } catch (err) {
    console.error("Error in editAnswer: ", err);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const deleteAnswer = async (req, res) => {
  const { answerId } = req.params;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute(
      "SELECT user_id FROM answers WHERE id = ?",
      [answerId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own answers" });
    }

    await db.execute("DELETE FROM answers WHERE id = ?", [answerId]);

    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
