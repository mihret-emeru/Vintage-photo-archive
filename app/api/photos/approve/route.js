// app/api/photos/approve/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Photo from "@/models/Photo";

export async function POST(req) {
  const body = await req.json();
  if (!body?.id || !body?.action)
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  await connectDB();

  if (body.action === "approve") {
    await Photo.findByIdAndUpdate(body.id, { approved: true });
    return NextResponse.json({ ok: true });
  } else if (body.action === "reject") {
    await Photo.findByIdAndDelete(body.id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
