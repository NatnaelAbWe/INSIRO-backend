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
