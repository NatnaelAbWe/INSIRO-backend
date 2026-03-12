import { db } from "../config/db.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
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

export const register = async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/;
    const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    const nameRegex = /^[A-Za-z]{5,9}$/;

    const { email, password, userName, name } = req.body;

    if (!email || !password || !userName || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "invalid email format" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–20 characters and contain uppercase, lowercase, number, and special character",
      });
    }
    if (!userNameRegex.test(userName)) {
      return res.status(400).json({ message: "invalid user name entered" });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "invalid name" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const [rows] = await db.execute("SELECT * from user WHERE email= ?", [
      normalizedEmail,
    ]);

    if (rows.length != 0) {
      return res.status(400).json({ message: "user already exists" });
    }
    const userId = nanoid(15);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute(
      "INSERT INTO user (id, name, password, username, email) VALUES (?,?,?,?,?)",
      [userId, name, hashedPassword, userName, normalizedEmail],
    );

    return res.status(201).json({ message: "user successfully created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
