import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";
import fs from "fs";
import path from "path";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();

    const files = formData.getAll("files"); // array of files
    const title = formData.get("title") || "";
    const history = formData.get("history") || "";

    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "vintage-photos" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        const doc = new Photo({
          userId: null,
          imageUrl: result.secure_url,
          title,
          history,
          approved: false,
        });

        await doc.save();
        return NextResponse.json({ ok: true, photo: doc }, { status: 201 });
      }
    );

    // Convert buffer to stream
    const stream = require("stream");
    const readable = new stream.PassThrough();
    readable.end(buffer);
    readable.pipe(uploadResult);

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
  }
}
