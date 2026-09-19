import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ProgramPricing {
  name: string;
  description: string | null;
  priceOnce: number | null;
  priceFourX: number | null;
  validityWeeks: number;
}

const PROGRAM_ORDER = [
  "Privat Class",
  "Privat Grup Class",
  "Reguler Class",
  "Privat Hydrotherapy",
  "Hydrotherapy Grup",
];

export async function getPublicPrograms(): Promise<ProgramPricing[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("membership_packages")
    .select("name, price, sessions_included, validity_weeks, description")
    .eq("is_active", true)
    .order("name");

  const byProgram = new Map<string, ProgramPricing>();

  for (const row of data ?? []) {
    const program = row.name.split(" - ")[0];
    const existing = byProgram.get(program) ?? {
      name: program,
      description: null,
      priceOnce: null,
      priceFourX: null,
      validityWeeks: row.validity_weeks,
    };
    if (row.sessions_included === 1) {
      existing.priceOnce = Number(row.price);
      existing.description = row.description;
    } else if (row.sessions_included === 4) {
      existing.priceFourX = Number(row.price);
      existing.description ??= row.description;
    }
    byProgram.set(program, existing);
  }

  return PROGRAM_ORDER.map((name) => byProgram.get(name)).filter(
    (program): program is ProgramPricing => Boolean(program)
  );
}
