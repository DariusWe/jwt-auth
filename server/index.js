require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const PORT = 3001;

const secretKey = process.env.SECRET_KEY;

// Simulate a database with user credentials (email and hashed password):
const users = [{ id: 1, email: "testuser@gmail.com", hashedPassword: "" }];
const plaintextPassword = "password123";

bcrypt.hash(plaintextPassword, 10, (err, hash) => {
  if (err) {
    console.log(err);
  } else {
    users[0].hashedPassword = hash;
  }
});

// Custom middleware to allow CORS
// (source: https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets)
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("Status 401: Unauthorized" );
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json("Status 403: Forbidden" );
    }
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  bcrypt.compare(password, user.hashedPassword, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result) {
      const expiresIn = "1h";
      const token = jwt.sign({ userId: user.email }, secretKey, { expiresIn }); // Use shorter expiration and refresh token
      res.json({ token, expiresIn });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.get("/my", authenticateToken, (req, res) => {
  res.json("This is a successful server response");
  // if success, send some data to client
});

app.listen(PORT, () => {
  console.log("Server running on port 3001");
});
