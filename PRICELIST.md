# Bugar Swim Pricelist (client-supplied flyer)

Source: flyer image supplied by the client, September 2026. Prices inserted
into `membership_packages` (10 rows: 5 class types × 1x/4x pertemuan tiers).

## Class types

| Class | Members : Coach | Duration | 1x pertemuan | 4x pertemuan |
|---|---|---|---|---|
| Privat Class | 1:1 | 60 menit | Rp110.000 | Rp420.000 |
| Privat Grup Class | 2:1 | 75 menit | Rp160.000 | Rp600.000 |
| Reguler Class | 3-5:1 | 90 menit | Rp50.000 | Rp180.000 |
| Privat Hydrotherapy | 1:1 | 60 menit | Rp110.000 | Rp420.000 |
| Hydrotherapy Grup | 2:1 | 75 menit | Rp160.000 | Rp600.000 |

## Programs

- **Les Renang** — untuk anak-anak, dewasa, dan lansia.
- **Hydrotherapy** — untuk anak berkebutuhan khusus, HNP (saraf kejepit), OA
  (osteoarthritis), kelainan tulang belakang, recovery stroke, dll.

## Terms

1. Harga belum termasuk tiket masuk kolam renang.
2. Paket (4x pertemuan) berlaku 6 minggu.
3. Pembayaran dilakukan di awal pertemuan.

## Contact

- WhatsApp: 0895-6338-32778
- Instagram/TikTok: @bugarswim.smg
- Lokasi: Semarang & Ungaran

## Schema note

`membership_packages.billing_cycle` only allows `monthly`/`quarterly`/`yearly`
— none of these actually fit a "4x pertemuan, berlaku 6 minggu" session pack.
Stored as `monthly` as the closest available value; the real validity term is
in each row's `description`. Same underlying mismatch as the session-based
attendance data (see `session_payments` in the migrations) — this business
sells per-session/per-pack, not calendar-cycle subscriptions.
