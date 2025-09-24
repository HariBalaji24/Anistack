import User from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { oauth2client } from "../utils/googleconfig.js";
import axios from "axios"
const secretkey = process.env.SECRETKEY;


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newuser._id }, secretkey, { expiresIn: "7d" });
    res.status(200).header("authorization", token).json({
      success: true,
      user: newuser,
      token,
    });
    jwttoken = req.headers["authorization"];
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No such email found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password incorrect" });

    const token = jwt.sign({ id: user._id }, secretkey, { expiresIn: "7d" });

    res.status(200).header("authorization", token).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const googlelogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "No code provided" });

    // Get tokens from Google
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    // Get user info from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    // Find or create user in DB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image: picture });
    }

    // Sign JWT with "id" field (consistent)
    const token = jwt.sign({ id: user._id, email }, secretkey, { expiresIn: "7d" });

    return res.status(200).json({ message: "Success", token, user });
  } catch (err) {
    console.error("Google login error:", err.message, err.stack);
    return res.status(500).json({ message: "Google login failed", error: err.message });
  }
};
