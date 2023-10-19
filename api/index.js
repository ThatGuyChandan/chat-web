const express = require("express");
const User = require("./models/User");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddelware = multer({ dest: "uploads/" });

const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws");

require("dotenv").config();
app.use("/uploads", express.static(__dirname + "/uploads"));

const app = express();
app.use(express.json());
const port = 4040;
const jwtSecret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPass = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      username: username,
      password: hashedPass,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to register" });
  }
});
//profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.error(err);
        res.status(401).json("Token verification failed");
      } else {
        res.json(userData);
      }
    });
  } else {
    res.status(401).json("No token");
  }
});

//login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});
const server = app.listen(port);
const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
