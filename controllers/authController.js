import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute("SELECT * FROM user where email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "user not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ Message: "incorrect password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JW_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token: token,
      email: email,
      userName: user.username,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
