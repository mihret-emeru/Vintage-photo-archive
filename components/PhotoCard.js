// components/PhotoCard.jsx
"use client";
import { useState } from "react";

export default function PhotoCard({ photo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="photo-card">
      <img src={photo.imageUrl} alt={photo.title || "vintage"} />
      <div className="meta">
        <h3>{photo.title || "Untitled"}</h3>
        {photo.history ? (
          <button className="history-btn" onClick={() => setOpen((o) => !o)}>
            {open ? "Hide" : "View Story"}
          </button>
        ) : (
          <span style={{ color: "var(--muted)", fontSize: 13 }}></span>
        )}
      </div>
      {open && photo.history && (
        <div className="history-text">{photo.history}</div>
      )}
    </div>
  );
}
