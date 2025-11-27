// app/api/photos/getApproved/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";

export async function GET() {
  await connectDB();
  const photos = await Photo.find({ approved: true })
    .sort({ createdAt: 1 })
    .lean();
  return NextResponse.json({ photos });
}
