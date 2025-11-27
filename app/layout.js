import "./globals.css";

export const metadata = {
  title: "Classic Capture - Vintage Archive",
  description: "Ethiopian & Eritrean vintage photo archive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
