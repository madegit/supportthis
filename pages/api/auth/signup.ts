import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";
import { isUsernameTaken, isUsernameValid } from "../../../utils/usernameUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, username } = req.body;

  if (!name || !email || !password || !username) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate username
    if (!isUsernameValid(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    // Check if username is taken
    if (await isUsernameTaken(username)) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      username: username.toLowerCase(),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
}
