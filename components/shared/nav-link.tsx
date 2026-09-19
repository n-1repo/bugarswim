"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  exact,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-sidebar-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "border-gold bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}
