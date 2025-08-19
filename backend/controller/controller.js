const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Credentials = require("../models/models"); // login/register
const User = require("../models/user"); // profile

// ✅ Registration
const getData = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Received Data:", req.body);

    // Check if user exists
    const existingUser = await Credentials.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await Credentials.create({ username, email, password: hashedPassword });
    return res.status(200).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Error in getData:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Login
const checkData = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Credentials.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // JWT
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Valid User", token, username: user.username });
  } catch (err) {
    console.error("Error in checkData:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

// ✅ Save user profile data
const userData = async (req, res) => {
  const { username, data } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { ...data } },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "User data saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving user data", error });
  }
};

// ✅ Get user profile data
const getuserData = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user data", error });
  }
};

exports.getData = getData;
exports.checkData = checkData;
exports.userData = userData;
exports.getuserData = getuserData;
