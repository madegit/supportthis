import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/User";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

function generateUniqueFilename(originalFilename: string, prefix: string): string {
  const uniqueString = crypto.randomBytes(4).toString("hex");
  const extension = path.extname(originalFilename);
  return `${prefix}_${uniqueString}${extension}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Upload image API route called");

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.log("Unauthorized access attempt");
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    console.log(`Method not allowed: ${req.method}`);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    console.log("Connected to database");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    console.log("Upload directory:", uploadDir);

    if (!fs.existsSync(uploadDir)) {
      console.log("Creating upload directory");
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024, // 20MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ message: "Error parsing form data", error: err.message });
      }

      console.log("Files received:", files);

      const avatarFile = Array.isArray(files.avatar_image) ? files.avatar_image[0] : files.avatar_image;
      const coverFile = Array.isArray(files.cover_image) ? files.cover_image[0] : files.cover_image;

      if (!avatarFile && !coverFile) {
        console.log("No image file provided");
        return res.status(400).json({ message: "No image file provided" });
      }

      const fileToProcess = avatarFile || coverFile;
      const imageType = avatarFile ? "avatar" : "cover";

      const oldPath = fileToProcess.filepath;
      const originalFilename = fileToProcess.originalFilename || "unnamed_file";
      const uniqueFilename = generateUniqueFilename(originalFilename, imageType);
      const newPath = path.join(uploadDir, uniqueFilename);

      console.log("Old path:", oldPath);
      console.log("New path:", newPath);

      if (!oldPath) {
        console.error("Error: File path is undefined");
        return res.status(500).json({ message: "Error: File path is undefined" });
      }

      try {
        await fs.promises.rename(oldPath, newPath);
        console.log("File moved successfully");
      } catch (renameError) {
        console.error("Error moving file:", renameError);
        return res.status(500).json({
          message: "Error moving uploaded file",
          error: renameError.message,
        });
      }

      try {
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
          console.log("User not found:", session.user?.email);
          return res.status(404).json({ message: "User not found" });
        }

        const imageUrl = `/uploads/${uniqueFilename}`;
        if (imageType === "avatar") {
          user.avatarImage = imageUrl; // Changed from 'image' to 'avatarImage'
        } else {
          user.coverImage = imageUrl;
        }

        await user.save();
        console.log(`User ${imageType} updated:`, imageUrl);

        return res.status(200).json({
          message: `${imageType === "avatar" ? "Avatar" : "Cover image"} uploaded successfully`,
          imageUrl: imageUrl,
        });
      } catch (userUpdateError) {
        console.error("Error updating user:", userUpdateError);
        return res.status(500).json({
          message: "Error updating user",
          error: userUpdateError.message,
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
}