"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Search" },
  { href: "/inventory", label: "Inventory" },
  { href: "/export", label: "Export" },
  { href: "/settings", label: "Settings" }
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="nav-inner">
        <Link href="/" className="brand-mark" aria-label="Comper home">
          <Image src="/icon.svg" alt="" width={22} height={22} className="brand-logo" priority />
          <span className="brand-text">Comper</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={active ? "nav-link active" : "nav-link"}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
