// /lib/export/filename.ts
export function ensureXlsx(name: string) {
  const trimmed = (name ?? "").trim();
  const base = trimmed.length ? trimmed : "export";
  const safe = base.replace(/[\\/:*?"<>|]/g, "-"); // Windows-safe
  return safe.toLowerCase().endsWith(".xlsx") ? safe : `${safe}.xlsx`;
}
