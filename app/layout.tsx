import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NavBar } from "@/components/NavBar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Comper",
  description: "Cross-reference sneaker resale prices across major marketplaces"
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
