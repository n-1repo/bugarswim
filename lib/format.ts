const JAKARTA_TZ = "Asia/Jakarta";

export function formatCurrency(value: number | string): string {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export function formatCurrencyCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("id-ID", { timeZone: JAKARTA_TZ });
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("id-ID", { timeZone: JAKARTA_TZ });
}

export function formatTime(value: string | Date): string {
  return new Date(value).toLocaleTimeString("id-ID", { timeZone: JAKARTA_TZ });
}

export function formatMonth(value: string | Date): string {
  return new Date(value).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: JAKARTA_TZ,
  });
}
