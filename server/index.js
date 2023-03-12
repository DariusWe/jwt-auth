require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const PORT = 3001;

const secretKey = process.env.SECRET_KEY;

// Simulate a database with user credentials (email and hashed password):
const users = [{ id: 1, email: "testuser@gmail.com", password: "" }];
const plaintextPassword = "password123";

bcrypt.hash(plaintextPassword, 10, (err, hash) => {
  if (err) {
    console.log(err);
  } else {
    users[0].password = hash;
  }
});

// Custom middleware to allow CORS
// (source: https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets)
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(401).json({ error: "Invalid email" });
    return;
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result) {
      const expiresIn = 7200;
      const token = jwt.sign({ userId: user.email }, secretKey, { expiresIn }); // Use shorter expiration and refresh token
      res.json({ token, expiresIn });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });
});

app.get("/my", (req, res) => {
  // receive token as cookie
  // validate token
  // if success, send some data to client
});

app.listen(PORT, () => {
  console.log("Server running on port 3001");
});
