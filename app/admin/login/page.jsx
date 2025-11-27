// app/admin/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMsg("Signing in...");
    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: pw }),
    });
    const j = await res.json();
    if (res.ok) {
      setMsg("Signed in.");
      router.push("/admin");
    } else {
      setMsg(j.error || "Failed");
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
        Admin Login
      </h2>
      <form onSubmit={submit} style={{ marginTop: 12, maxWidth: 420 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="btn"
            style={{ display: "block", width: "100%", marginTop: 8 }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          Password
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="btn"
            style={{ display: "block", width: "100%", marginTop: 8 }}
          />
        </label>
        <div style={{ marginTop: 10 }}>
          <button className="btn" type="submit">
            Login
          </button>
          <a href="/" className="btn secondary" style={{ marginLeft: 8 }}>
            Back
          </a>
        </div>
        {msg && (
          <div style={{ marginTop: 10, color: "var(--muted)" }}>{msg}</div>
        )}
      </form>
    </div>
  );
}
