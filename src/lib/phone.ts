export function normalizePhoneForTel(phone: string): string {
  if (!phone) return "";
  return phone
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");
}
