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

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saved = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "vintage-photos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      const doc = new Photo({
        userId: null,
        imageUrl: uploadResult.secure_url, // Cloudinary URL
        title,
        history,
        approved: false,
      });

      await doc.save();
      saved.push(doc);
    }

    return new Response(JSON.stringify({ ok: true, saved }), { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Server error during upload", { status: 500 });
  }
}
