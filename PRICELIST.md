# Bugar Swim Pricelist (client-supplied flyer)

Source: flyer image supplied by the client, September 2026. Prices inserted
into `membership_packages` (10 rows: 5 class types × 1x/4x pertemuan tiers).

## Class types

| Class | Members : Coach | Duration | 1x pertemuan | 4x pertemuan |
|---|---|---|---|---|
| Private Class | 1:1 | 60 menit | Rp110.000 | Rp420.000 |
| Private Grup Class | 2:1 | 75 menit | Rp160.000 | Rp600.000 |
| Reguler Class | 3-5:1 | 90 menit | Rp50.000 | Rp180.000 |
| Private Hydrotherapy | 1:1 | 60 menit | Rp110.000 | Rp420.000 |
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

`membership_packages` now models this natively: `sessions_included` (1 or 4)
and `validity_weeks` (6) replace the old calendar `billing_cycle`. Buying a
pack (`subscriptions`) auto-creates one invoice for the full price, due
immediately (paid upfront, per the terms above) — see
`supabase/migrations/20250101000012_session_packages.sql`.
