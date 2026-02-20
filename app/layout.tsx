import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavBar } from "@/components/NavBar";

import "./globals.css";

const appName = "Comper";
const appDescription =
  "Compare sneaker resale prices instantly across marketplaces to comp faster and make better buy/sell decisions.";
const defaultLocalUrl = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return defaultLocalUrl;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    defaultLocalUrl
);
const ogImagePath = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: appName,
  alternates: {
    canonical: "/"
  },
  title: {
    default: appName,
    template: `%s | ${appName}`
  },
  description: appDescription,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    type: "website",
    siteName: appName,
    title: appName,
    description: appDescription,
    url: siteUrl,
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Comper logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: appDescription,
    images: [ogImagePath]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
