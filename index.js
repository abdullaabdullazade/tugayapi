const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const user = require("./userSchema");
const cors = require("cors");
const app = express();
const fs = require("fs");
const photoSheme = require("./photosScheme");
const multer = require("multer");
mongoose
  .connect("mongodb://localhost:27017/backend")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).send("Kisi bala max 6 mb ola biler.");
  }
  next(err);
});

app.get("/", (req, res) => {
  const token = req.cookies.authToken;
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use(express.static("frontend"));
  //jwt check

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

    //jwt yaradıram

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

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const tempName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, tempName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 24 * 1024 * 1024 },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("a");
  try {
    const { title } = req.body;
    path.join(__dirname, "uploads", req.file.filename);

    await new photoSheme({ photoname: req.file.filename, title: title }).save();
    return res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(400).send("Yükləmə zamanı xəta baş verdi.");
  }
});

app.get("/photos", async (req, res) => {
  try {
    const photos = await photoSheme.find();
    console.log(photos);
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Xəta baş verdi.");
  }
});

app.listen(3000, () => {
  console.log("hello, http://localhost:3000");
});
