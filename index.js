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
  .connect("mongodb://localhost:27017/backend")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.get("/", (req, res) => {
  const token = req.cookies.authToken;
  app.use(express.static("frontend"));

  if (token) {
    jwt.verify(token, "tugayows", (err, decoded) => {
      if (err) {
        return res.sendFile(path.join(__dirname, "frontend/index.html"));
      } else {
        return res.sendFile(path.join(__dirname, "frontend/photo_upload.html"));
      }
    });
  } else {
    return res.sendFile(path.join(__dirname, "frontend/index.html"));
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.log(email, password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({ email, password: hashedPassword });
    await newUser.save();
    console.log("ha");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
      "tugayows",
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
