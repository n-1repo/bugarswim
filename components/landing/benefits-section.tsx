import { Award, MapPinned, ShieldCheck, Users } from "lucide-react";

const BENEFITS = [
  {
    icon: Award,
    title: "Coach Berpengalaman",
    description: "Dibimbing coach renang dan hydrotherapy yang terlatih dan berpengalaman.",
  },
  {
    icon: Users,
    title: "Kelompok Kecil",
    description: "Kelas privat 1:1 hingga reguler maksimal 5 anak per coach, tetap terpantau.",
  },
  {
    icon: MapPinned,
    title: "2 Lokasi Kolam",
    description: "Pilih kolam yang paling dekat di Semarang atau Ungaran.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Nyaman",
    description: "Program disesuaikan dengan usia, kemampuan, dan kebutuhan pemulihan.",
  },
];

export function BenefitsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Kenapa Bugar Swim?
        </h2>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <benefit.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-sm font-semibold">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
