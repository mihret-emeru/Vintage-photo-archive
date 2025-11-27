// app/upload/page.jsx
"use client";
import { useState } from "react";

export default function UploadPage() {
  const [step, setStep] = useState("check"); // check, register, upload
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState("");

  // quick function to check if user has token cookie (simple check)
  function hasUserToken() {
    return document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("token="));
  }

  async function goUpload() {
    if (hasUserToken()) {
      setStep("upload");
    } else {
      setStep("register");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("Registering...");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password: pw }),
    });
    const j = await res.json();
    if (res.ok) {
      setMessage("Registered. You can now upload.");
      setStep("upload");
    } else {
      setMessage(j.error || "Register failed");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length) {
      setMessage("Pick files");
      return;
    }
    setMessage("Uploading...");
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("title", title);
    fd.append("history", history);
    // optional: include userId from token - skipped for simplicity
    const res = await fetch("/api/photos/upload", { method: "POST", body: fd });
    const j = await res.json();
    if (res.ok) {
      setMessage("Uploaded — pending admin approval.");
      setFiles([]);
      setTitle("");
      setHistory("");
    } else {
      setMessage(j.error || "Upload failed");
    }
  }

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
        Upload Photos
      </h2>

      {step === "check" && (
        <div style={{ marginTop: 18 }}>
          <p style={{ color: "var(--muted)" }}>
            To upload photos, you need to register (one-time). Click below to
            continue.
          </p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={goUpload}>
              Continue
            </button>
            <a href="/" className="btn secondary" style={{ marginLeft: 12 }}>
              Back
            </a>
          </div>
        </div>
      )}

      {step === "register" && (
        <form
          onSubmit={handleRegister}
          style={{ marginTop: 18, maxWidth: 520 }}
        >
          <label style={{ display: "block", marginBottom: 8 }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 8 }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 8 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 8 }}
            />
          </label>
          <div style={{ marginTop: 10 }}>
            <button className="btn" type="submit">
              Register & Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("check")}
              className="btn secondary"
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
          {message && (
            <div style={{ marginTop: 12, color: "var(--muted)" }}>
              {message}
            </div>
          )}
        </form>
      )}

      {step === "upload" && (
        <form onSubmit={handleUpload} style={{ marginTop: 18, maxWidth: 640 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Choose images (multiple allowed)
            <input
              type="file"
              name="files"          // <-- add this
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              style={{ display: "block", marginTop: 8 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            Title (optional)
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 8 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            History (optional)
            <textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              rows={4}
              style={{
                display: "block",
                width: "100%",
                marginTop: 8,
                padding: 10,
              }}
            />
          </label>

          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit">
              Upload
            </button>
            <a href="/" className="btn secondary" style={{ marginLeft: 8 }}>
              Back to Gallery
            </a>
          </div>

          {message && (
            <div style={{ marginTop: 12, color: "var(--muted)" }}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
