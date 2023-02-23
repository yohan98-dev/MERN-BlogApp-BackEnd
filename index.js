const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();
const User = require("./models/User");
const jwt = require("jsonwebtoken");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

mongoose.connect(
  "mongodb+srv://yohan98:ngSwmqlNDBy7ZLw8@cluster0.7djhlwz.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.listen(4000);

//ngSwmqlNDBy7ZLw8

//mongodb+srv://yohan98:ngSwmqlNDBy7ZLw8@cluster0.7djhlwz.mongodb.net/?retryWrites=true&w=majority
