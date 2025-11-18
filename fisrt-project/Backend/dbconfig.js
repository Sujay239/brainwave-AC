const mysql = require("mysql2/promise");
require("dotenv").config();

const host = process.env.HOST;
const username = process.env.USER;
const pass = process.env.PASSWORD;
const database = process.env.DB;
const port = process.env.PORT;

const pool = mysql.createPool({
  host,
  user: username,
  password: pass,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
