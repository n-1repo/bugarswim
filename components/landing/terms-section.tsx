import { CalendarClock } from "lucide-react";

export function TermsSection({ validityWeeks }: { validityWeeks: number }) {
  const terms = [
    "Harga yang tertera belum termasuk tiket masuk kolam renang.",
    `Paket 4x pertemuan berlaku ${validityWeeks} minggu.`,
    "Pembayaran dilakukan di awal pertemuan.",
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 sm:pb-20">
      <div className="flex flex-col gap-4 rounded-2xl bg-sidebar p-6 text-sidebar-foreground sm:flex-row sm:items-start">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-base font-semibold">Keterangan</h2>
          <ol className="mt-2 flex flex-col gap-1.5 text-sm text-sidebar-foreground/85">
            {terms.map((term, i) => (
              <li key={term} className="flex gap-2">
                <span className="text-gold">{i + 1}.</span>
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
