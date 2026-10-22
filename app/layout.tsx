import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  DEFAULT_THEME,
  FAVICON_VERSION,
  METADATA,
  SITE_NAME,
  SITE_URL,
  THEME_BOOTSTRAP_SCRIPT,
} from "./constants";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: METADATA.title,
  description: METADATA.description,
  openGraph: {
    title: METADATA.title,
    description: METADATA.ogDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: METADATA.ogImage, width: 1200, height: 630, alt: METADATA.ogImageAlt }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: METADATA.title,
    description: METADATA.ogDescription,
    images: [METADATA.ogImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <link rel="icon" href={`/favicon.ico?v=${FAVICON_VERSION}`} sizes="32x32" />
        <link rel="icon" href={`/favicon.svg?v=${FAVICON_VERSION}`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${FAVICON_VERSION}`} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
