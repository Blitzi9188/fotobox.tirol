import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fotobox Tirol CMS",
  description: "Custom CMS mit Next.js für Fotobox Tirol"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
