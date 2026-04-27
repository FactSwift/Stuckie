import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "STUCKIE — Financial Terminal",
  description: "Stonk Tycoon — Edukasi Investasi Berbasis Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
