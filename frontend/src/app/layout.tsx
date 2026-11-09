import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STREAMVERSE – All-in-One OTT Discovery & Streaming Platform",
  description: "One centralized hub for Netflix, Prime Video, JioHotstar, ZEE5, Sony LIV and Licensed Indie Cinema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-white min-h-screen antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

