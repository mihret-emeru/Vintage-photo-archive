// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, email, password } = body;
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json({ error: "User exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "30d",
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, { httpOnly: true, path: "/" });
  return res;
}
