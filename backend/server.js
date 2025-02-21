import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      eager: [
        { width: 300, height: 250, crop: "fill" },
        { width: 728, height: 90, crop: "fill" },
        { width: 160, height: 600, crop: "fill" },
        { width: 300, height: 600, crop: "fill" },
      ],
    });

    fs.unlinkSync(req.file.path);
    const transformedUrls = result.eager.map(
      (transformation) => transformation.secure_url
    );
    res.json({ success: true, urls: transformedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
