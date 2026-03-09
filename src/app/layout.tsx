import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fotoboxtirol-production.up.railway.app"),
  title: {
    default: "Fotobox Tirol das Original",
    template: "%s"
  },
  description: "Fotobox Tirol das Original fuer Hochzeiten, Firmenfeiern und Events in Tirol."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
