"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/wip", label: "WIP" },
  { href: "/blog", label: "Blog" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="logo-link" aria-label="Home">
          <img src="/logo.png" alt="" width={28} height={28} className="logo" />
        </Link>

        <nav className="nav">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "active" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="topbar-spacer" aria-hidden="true" />
      </div>
    </header>
  );
}
