import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavBar } from "@/components/NavBar";

import "./globals.css";

const appName = "Comper";
const appDescription =
  "Compare sneaker resale prices instantly across marketplaces to comp faster and make better buy/sell decisions.";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: appName,
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
    url: "/",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Comper logo"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: appName,
    description: appDescription,
    images: ["/icon.svg"]
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
