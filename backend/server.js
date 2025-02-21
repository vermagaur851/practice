import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import serverless from "serverless-http";

dotenv.config();

const upload = multer({ dest: "/tmp/uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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

    const transformedUrls = result.eager.map((t) => t.secure_url);
    res.json({ success: true, urls: transformedUrls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default serverless(app);
