import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blink — links with proof",
  description: "Own and update short links on Stellar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

