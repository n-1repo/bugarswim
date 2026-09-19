import { z } from "zod";

export const packageSchema = z.object({
  name: z.string().min(2, "Nama paket wajib diisi"),
  price: z.coerce.number().nonnegative("Harga tidak valid"),
  sessionsIncluded: z.coerce.number().int().positive("Jumlah sesi tidak valid").optional(),
  validityWeeks: z.coerce.number().int().positive("Masa berlaku tidak valid").default(6),
  description: z.string().optional(),
});

export const subscriptionSchema = z.object({
  childId: z.string().uuid("Pilih anak"),
  packageId: z.string().uuid("Pilih paket"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
});
