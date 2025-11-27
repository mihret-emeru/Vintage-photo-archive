// app/admin/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

 async function load() {
  setLoading(true);

  const baseUrl =
    typeof window !== "undefined"
      ? "" // client-side relative fetch works
      : process.env.NEXT_PUBLIC_SITE_URL; // server-side full URL

  const res = await fetch(`${baseUrl}/api/photos/getPending`);
  const j = await res.json();
  setPending(j.photos || []);
  setLoading(false);
}


  useEffect(() => {
    load();
  }, []);

  async function act(id, action) {
  const baseUrl =
    typeof window !== "undefined"
      ? "" // client: relative URL works
      : process.env.NEXT_PUBLIC_SITE_URL; // server: use full URL from env

  await fetch(`${baseUrl}/api/photos/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action }),
  });

  load();
}


  return (
    <div className="container" style={{ paddingTop: 22 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
        Admin — Pending
      </h2>
      {loading && (
        <div style={{ marginTop: 12, color: "var(--muted)" }}>Loading...</div>
      )}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {pending.map((p) => (
          <div
            key={p._id}
            style={{ background: "#0f0f0f", borderRadius: 8, padding: 8 }}
          >
            <img
              src={p.imageUrl}
              alt={p.title}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--accent)",
                }}
              >
                {p.title || "Untitled"}
              </div>
              <div
                style={{ color: "var(--muted)", marginTop: 6, minHeight: 36 }}
              >
                {p.history || "No history"}
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => act(p._id, "approve")}>
                Approve
              </button>
              <button
                className="btn secondary"
                onClick={() => act(p._id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <a href="/" className="btn secondary">
          Back to Gallery
        </a>
      </div>
    </div>
  );
}
