import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anis Fajar Fakhruddin - Full-Stack Developer",
  description: "Experienced Full-Stack Developer with 3+ years of expertise in building scalable web applications. Currently leading technical architecture for healthcare systems serving 400K+ monthly users.",
  keywords: "Full-Stack Developer, TypeScript, Next.js, PHP, Laravel, React, Angular, MySQL, Redis, MongoDB, Google Cloud, Indonesia",
  authors: [{ name: "Anis Fajar Fakhruddin" }],
  creator: "Anis Fajar Fakhruddin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anisfajar.dev",
    siteName: "Anis Fajar Fakhruddin",
    title: "Anis Fajar Fakhruddin - Full-Stack Developer",
    description: "Experienced Full-Stack Developer with 3+ years of expertise in building scalable web applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anis Fajar Fakhruddin - Full-Stack Developer",
    description: "Experienced Full-Stack Developer with 3+ years of expertise in building scalable web applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
