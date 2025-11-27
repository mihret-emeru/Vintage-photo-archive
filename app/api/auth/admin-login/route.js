// app/api/auth/admin-login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true, email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("adminToken", token, { httpOnly: true, path: "/" });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
