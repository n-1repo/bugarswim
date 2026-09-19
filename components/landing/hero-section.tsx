import Link from "next/link";
import { CalendarCheck, MapPin, Waves } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WaveDivider } from "@/components/landing/wave-divider";

const TRUST_POINTS = [
  { icon: Waves, label: "Coach berpengalaman" },
  { icon: MapPin, label: "Semarang & Ungaran" },
  { icon: CalendarCheck, label: "Jadwal fleksibel" },
];

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10" />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-48 w-48 rounded-full bg-primary/20" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:flex-row lg:items-center lg:gap-12 lg:pb-28 lg:pt-24">
        <div className="flex flex-1 flex-col gap-5">
          <span className="inline-flex w-fit items-center rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
            Les Renang &amp; Hydrotherapy
          </span>
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Belajar Renang &amp; Pulih Lebih Cepat Bersama Bugar Swim
          </h1>
          <p className="max-w-xl text-base text-sidebar-foreground/85 sm:text-lg">
            Kelas renang untuk anak-anak, dewasa, dan lansia, serta program hydrotherapy
            untuk kebutuhan pemulihan khusus — dipandu coach berpengalaman di kolam
            pilihan Semarang &amp; Ungaran.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#paket"
              className={cn(buttonVariants({ size: "lg" }), "h-12 bg-gold text-gold-foreground hover:opacity-90")}
            >
              Lihat Paket &amp; Harga
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
          <dl className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
            {TRUST_POINTS.map((point) => (
              <div key={point.label} className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
                <point.icon className="h-4 w-4 text-gold" aria-hidden="true" />
                <span>{point.label}</span>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 sm:h-72 sm:w-72">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gold/90 sm:h-52 sm:w-52">
              <Waves className="h-20 w-20 text-gold-foreground sm:h-24 sm:w-24" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <WaveDivider className="absolute bottom-0 left-0 h-12 w-full sm:h-16" />
    </section>
  );
}
