import { Waves } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { NavLink } from "./nav-link";
import { CLUB_NAME } from "@/lib/config";

export interface NavItem {
  href: string;
  label: string;
}

export function AppShell({
  navItems,
  fullName,
  roleLabel,
  children,
}: {
  navItems: NavItem[];
  fullName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex items-center justify-between border-b border-border bg-card px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-gold-foreground">
            <Waves className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight text-primary">{CLUB_NAME}</span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {roleLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{fullName}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-1 flex-col sm:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto bg-sidebar p-2 sm:w-56 sm:flex-col sm:gap-1 sm:border-r sm:border-sidebar-border sm:p-3">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} exact={item.href.split("/").length <= 2}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0 flex-1 overflow-auto p-3 sm:p-4">{children}</main>
      </div>
    </div>
  );
}
