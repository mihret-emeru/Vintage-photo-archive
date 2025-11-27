// app/page.jsx
import PhotoCard from "@/components/PhotoCard";

async function getApprovedPhotos() {
  const base =
    typeof window !== "undefined"
      ? "" // client side → relative path works
      : process.env.NEXT_PUBLIC_SITE_URL; // server side → must use full URL

  const res = await fetch(`${base}/api/photos/getApproved`, {
    cache: "no-store",
  });

  const json = await res.json();
  return json.photos || [];
}


export default async function Home() {
  const photos = await getApprovedPhotos();

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <div>
          <img src="/improved.png" alt="hero" className="hero-image" />
        </div>
        <div>
          <h1 className="site-title">Classic Capture</h1>
          <div style={{ height: 6 }} />
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            <strong>Celebrating history through photography📷</strong>
          </div>
        </div>
      </div>

      {/* Welcome & collage */}
      <section style={{ marginTop: 24 }} className="welcome">
        <div className="welcome-text">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 40,
              marginBottom: 14,
            }}
          >
            Welcome!
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 420 }}>
            This collection brings together rare Ethiopian and Eritrean vintage
            photos, capturing the beauty of our shared history. These timeless
            memories remind us where we come from and celebrate the stories that
            shaped us.Each image carries a story, a culture, and a moment worth
            remembering.
          </p>
        </div>

        <div className="collage">
          {/* small collage placeholders; you will swap with your images */}
          <img
            src="/Oldcollagemain.jpg"
            alt="c1"
            style={{
              width: "100%", // fill the container width
              maxWidth: "600px", // optional: limit max width
              height: "auto", // maintain aspect ratio
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
        {/* Stair-like small images */}

        <div className="stair-images-section">
          <div className="stair-images">
            <img src="/Meneliktroops.png" alt="1" className="stair" />
            <img src="/Grandpawasemperor.jpg" alt="2" className="stair" />
            <img src="/Mengesitufirst.jpg" alt="3" className="stair" />
          </div>
        </div>
      </section>

      {/* Timeless label */}
      <section className="timeless">
        <h2>Timeless Photographs</h2>

        <div className="gallery-grid">
          {photos.map((p) => (
            <PhotoCard key={p._id} photo={p} />
          ))}
        </div>
      </section>

      <div className="left-panel">
        <div className="leftt">
          <img src="/AestheticPhotography.jpg" alt="1" className="camera" />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="bottom-buttons">
        <p className="share-text">Share your timeless moments</p>
        <a className="btn" href="/upload">
          Upload
        </a>
        <a className="btn secondary" href="/admin/login">
          Admin
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div
          style={{
            marginBottom: 8,
            fontFamily: "'Playfair Display', serif",
            fontSize: 15,
          }}
        >
          <div>Contact me at Telegram: @Merccy_19</div>
        </div>
      </footer>
    </div>
  );
}
