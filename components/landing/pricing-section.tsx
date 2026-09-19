import { formatCurrency } from "@/lib/format";
import type { ProgramPricing } from "@/lib/data/landing";

function PriceRow({ label, price }: { label: string; price: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-sidebar px-3 py-2 text-sidebar-foreground">
      <span className="text-xs font-medium text-sidebar-muted-foreground">{label}</span>
      <span className="font-heading text-base font-bold text-gold">{formatCurrency(price)}</span>
    </div>
  );
}

export function PricingSection({ programs, validityWeeks }: { programs: ProgramPricing[]; validityWeeks: number }) {
  if (programs.length === 0) return null;

  return (
    <section id="paket" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Paket &amp; Harga</h2>
          <p className="mt-2 text-muted-foreground">
            Pilih paket sekali pertemuan untuk coba dulu, atau paket 4x pertemuan (berlaku{" "}
            {validityWeeks} minggu) supaya lebih hemat.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.name}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div>
                <span className="inline-flex w-fit rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                  {program.name}
                </span>
                {program.description ? (
                  <p className="mt-3 text-sm text-muted-foreground">{program.description}</p>
                ) : null}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {program.priceOnce !== null ? <PriceRow label="1x Pertemuan" price={program.priceOnce} /> : null}
                {program.priceFourX !== null ? <PriceRow label="4x Pertemuan" price={program.priceFourX} /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
