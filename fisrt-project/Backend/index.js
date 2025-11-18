const express = require("express");
const path = require("path");
const db = require("./dbconfig");
const bcrypt = require("bcrypt");
const generateToken = require("./generateToken");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("./middleware/isLoggedIn");
const passwordMatcher = require("./middleware/passwordMatcher");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // change to your front-end origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you intend to send cookies
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", isLoggedIn, (req, res) => {
  res.send("app.tsx");
});

app.post("/create-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await encodePassword(password);
    const q = "SELECT * FROM users WHERE email = ?";
   const [rows] =  await db.query(q,[email]);
   if(rows && rows.length > 0){
   return res.status(409).json({error : "User already exists with this email, please try again with different eamil id."});
   }
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    console.log(hash);
    db.query(sql, [name, email, hash]);
    res.send("User created successfully please log in");
  } catch (err) {
    res.status(401).send(`Error occurred in inserting users ${err}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Fetch User ---
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(query, [email]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        error: `No user found with email: ${email}`,
      });
    }

    const user = rows[0];

    // --- Password Check ---
    const isPasswordCorrect = passwordMatcher(password, user.PASSWORD);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Wrong password. Please try again.",
      });
    }

    // --- Generate Token ---
    const token = await generateToken(user.username, user.email);

    // --- Send Cookie to Browser ---
    res.cookie("token", token, {
      httpOnly: true, // IMPORTANT: protects token
      secure: true, // set true in production (HTTPS)
      sameSite: "lax",
    });

    // --- Return Token to Frontend ---
    return res.json({
      message: `Welcome back ${user.username}! 👋`,
      token,
      name: user.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      error: "Something went wrong during login.",
    });
  }
});


app.post('/logout' , (req,res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.send({ message: "Logged out successfully" });
});


async function encodePassword(password) {
  const round = 10;
  const salt = await bcrypt.genSalt(round);
  const hashPass = await bcrypt.hash(password, salt);

  return hashPass;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
