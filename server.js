import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startDataBase } from "./config/init.js";
import authRoute from "./routes/authRoutes.js";
import questionRoute from "./routes/questionRoute.js";
import answerRoute from "./routes/answerRoute.js";

dotenv.config();

const server = express();
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

const connectDb = async () => {
  try {
    await startDataBase();
    console.log("connected with the database sucessfully!");
  } catch (err) {
    console.log("database connection failed!", err);
  }
};

await connectDb();

server.use("/api/auth", authRoute);
server.use("/api/question", questionRoute);
server.use("/api/answer", answerRoute);

server.listen(port, () => {
  console.log("your server is up and running on port:", port);
});
