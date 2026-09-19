import Link from "next/link";
import { AtSign, MapPin, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CLUB_NAME } from "@/lib/config";

const CONTACTS = [
  { icon: MessageCircle, label: "0895-6338-32778", href: "https://wa.me/6289563832778" },
  { icon: AtSign, label: "@bugarswim.smg", href: "https://instagram.com/bugarswim.smg" },
  { icon: MapPin, label: "Semarang & Ungaran", href: undefined },
];

export function SiteFooter() {
  return (
    <footer id="kontak" className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">Siap Mulai Berenang?</h2>
        <p className="max-w-xl text-sidebar-foreground/80">
          Hubungi kami untuk info jadwal dan pendaftaran, atau masuk ke akun jika Anda
          sudah menjadi member {CLUB_NAME}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/6289563832778"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold text-gold-foreground hover:opacity-90")}
          >
            Chat via WhatsApp
          </a>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 border-white/30 bg-transparent text-sidebar-foreground hover:bg-white/10"
            )}
          >
            Masuk ke Akun
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-sidebar-foreground/80">
          {CONTACTS.map((contact) =>
            contact.href ? (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <contact.icon className="h-4 w-4" aria-hidden="true" />
                {contact.label}
              </a>
            ) : (
              <span key={contact.label} className="flex items-center gap-2">
                <contact.icon className="h-4 w-4" aria-hidden="true" />
                {contact.label}
              </span>
            )
          )}
        </div>

        <p className="text-xs text-sidebar-muted-foreground">
          &copy; {new Date().getFullYear()} {CLUB_NAME}. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
