import Link from "next/link";
import { Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/shared/login-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CLUB_NAME } from "@/lib/config";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-sidebar p-4">
      <ThemeToggle className="absolute right-4 top-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/" className="group flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
            <Waves className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-sidebar-foreground/80 transition-colors group-hover:text-gold">
            Kembali ke Beranda
          </span>
        </Link>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{CLUB_NAME}</CardTitle>
            <CardDescription>Masuk ke akun klub renang Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
