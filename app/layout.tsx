import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000"),
  title: "Blink — links with proof",
  description: "Own and update short links on Stellar.",
  icons: {
    icon: "/brand/blink-mark-512.png",
    apple: "/brand/blink-mark-512.png",
  },
  openGraph: {
    title: "Blink — links with proof",
    description: "Wallet-owned short links powered by Stellar and Soroban.",
    images: ["/brand/blink-mark-512.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
