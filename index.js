const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const user = require("./userSchema");
const cors = require("cors");
const app = express();

mongoose
  .connect(
    "mongodb+srv://rfolessons2:I1JYTDqTJil1UDzA@abdullaxows.7uu95.mongodb.net/backend"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("frontend"));
//app.use(cors());
app.get("/", (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        return res.sendFile(path.join(__dirname, "frontend/index.html"));
      }
      return res.sendFile(path.join(__dirname, "frontend/protected.html"));
    });
  } else {
    res.sendFile(path.join(__dirname, "frontend/index.html"));
  }
});

app.get("/file_upload", (req, res) => {
  return res.sendFile(path.join(__dirname, "frontend/photo_upload.html"));
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.post("/login", async (req, res) => {
  console.log("hello");
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const finduser = await user.findOne({ email });
    if (!finduser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, finduser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: finduser._id, email: finduser.email },
      "secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("authToken", token, {
      maxAge: 3600000,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
