import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 5,
  queueLimit: 0,
  idleTimeout: 50000,
});

console.log(process.env.DB_USER);
