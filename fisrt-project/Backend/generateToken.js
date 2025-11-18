const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (username, email) => {
  try {
    const token = jwt.sign(
      { user: username, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" }
    );

    return token;
  } catch (err) {
    console.log("Error in generating JWT token:", err);
    throw err;
  }
};

module.exports = generateToken;
