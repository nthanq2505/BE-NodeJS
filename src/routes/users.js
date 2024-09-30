const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authentication = require("../middlewares/authentication");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ message: "Bad Request" });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).send({ message: "Invalid password" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ token: token, message: "Login success" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ message: "Bad Request" });
    }

    const user = await User.findOne({ username: username });
    if (user) {
      res.status(409).send({ message: "Username already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({ message: "User created" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
