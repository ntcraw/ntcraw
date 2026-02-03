import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Infrastructure Learning",
  description: "Interactive learning system for large-model training infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
