export const dynamic = "force-dynamic";

import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export function generateMetadata(): Metadata {
  return {
    title: "Ikigai",
    description: "Connect, track, transfer, secured and private.",
    icons: {
      icon: "/icons/logo.svg",
    },
    other: {
      ...Sentry.getTraceData(),
    },
    referrer: "no-referrer-when-downgrade",
    viewport: "width=device-width, initial-scale=1.0",
    openGraph: {
      type: "website",
      siteName: "Ikigai Banking",
    },
    twitter: {
      card: "summary_large_image",
      site: "@ikigaibanking",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
