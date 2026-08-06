import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbyaj.dev"),
  title: "AJ Adversalo — Full-Stack Developer",
  description:
    "AJ Adversalo is a product-minded full-stack developer building useful, thoughtful digital experiences.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "AJ Adversalo — Full-Stack Developer",
    description: "I build digital things that work.",
    url: "https://builtbyaj.dev",
    siteName: "Built by AJ",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AJ Adversalo — I build digital things that work." }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AJ Adversalo — Full-Stack Developer",
    description: "I build digital things that work.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
