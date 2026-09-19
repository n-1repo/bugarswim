import { HeartPulse, Waves } from "lucide-react";

const PROGRAMS = [
  {
    icon: Waves,
    title: "Les Renang",
    description: "Untuk anak-anak, dewasa, dan lansia.",
  },
  {
    icon: HeartPulse,
    title: "Hydrotherapy",
    description:
      "Untuk anak berkebutuhan khusus, HNP (saraf terjepit), OA (osteoarthritis), kelainan tulang belakang, recovery stroke, dan lainnya.",
  },
];

export function ProgramsSection() {
  return (
    <section id="program" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Program Kami</h2>
        <p className="mt-2 text-muted-foreground">
          Dua program utama yang dirancang sesuai kebutuhan dan usia setiap member.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROGRAMS.map((program) => (
          <div
            key={program.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <program.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-lg font-semibold">{program.title}</h3>
            <p className="text-sm text-muted-foreground">{program.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
