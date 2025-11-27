import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";



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
    const files = formData.getAll("files");
    const title = formData.get("title") || "";
    const history = formData.get("history") || "";

    if (!files || !files.length) {
      return new Response(JSON.stringify({ error: "No files uploaded" }), { status: 400 });
    }

    const savedPhotos = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await new Promise((resolve, reject) => {
         const cloudStream = cloudinary.uploader.upload_stream(
          { folder: "vintage-photos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        cloudStream.end(buffer);
      });

      const doc = new Photo({
        userId: null,
        imageUrl: uploaded.secure_url,
        title,
        history,
        approved: false,
      });

      await doc.save();
      savedPhotos.push(doc);
    }

    return new Response(JSON.stringify({ ok: true, photos: savedPhotos }), { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: "Server error during upload" }), { status: 500 });
  }
}
