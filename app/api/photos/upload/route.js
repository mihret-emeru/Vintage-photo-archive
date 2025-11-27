import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";
import fs from "fs";
import path from "path";

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

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, buffer);

      const doc = new Photo({
        userId: null, // optional: get from token if needed
        imageUrl: `/uploads/${filename}`,
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
    return NextResponse.json(
      { error: "Server error during upload" },
      { status: 500 }
    );
  }
}
