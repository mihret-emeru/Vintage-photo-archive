import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";
import stream from "stream";


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
    const files = formData.getAll("files"); // must match input name="files"
    const title = formData.get("title") || "";
    const history = formData.get("history") || "";

    if (!files || !files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const saved = [];

    // Loop through all files
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Wrap upload_stream in a Promise to await
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "vintage-photos" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        const readable = new stream.PassThrough();
        readable.end(buffer);
        readable.pipe(uploadStream);
      });

      // Save to MongoDB
      const doc = new Photo({
        userId: null,
        imageUrl: result.secure_url,
        title,
        history,
        approved: false,
      });

      await doc.save();
      saved.push(doc);
    }

    return NextResponse.json({ ok: true, saved }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
  }
}
