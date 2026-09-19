import Link from "next/link";
import { Waves } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { CLUB_NAME } from "@/lib/config";

const NAV_LINKS = [
  { href: "#program", label: "Program" },
  { href: "#paket", label: "Paket & Harga" },
  { href: "#kontak", label: "Kontak" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="#top" className="flex items-center gap-2 font-heading text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-gold-foreground">
            <Waves className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span>{CLUB_NAME}</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-sidebar-muted-foreground">
              Swimming &amp; Hydrotherapy
            </span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-sidebar-foreground/90 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "sm" }), "bg-gold text-gold-foreground hover:opacity-90")}
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
