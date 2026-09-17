import Link from "next/link";
import { LogoutButton } from "./logout-button";

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
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Bugarswim</span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {roleLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{fullName}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-1 flex-col sm:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2 sm:w-56 sm:flex-col sm:border-b-0 sm:border-r sm:p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
