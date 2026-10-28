// filters are kept in the url query string

export const FILTER_KEYS = ["from", "to", "callerNumber", "receiverNumber", "city", "direction", "status"];

export const EMPTY_FILTERS = Object.fromEntries(FILTER_KEYS.map((key) => [key, ""]));

export function readFilters(searchParams) {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? ""]));
}

export function toQueryString(filters, extra = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...extra })) {
    const text = String(value ?? "").trim();
    if (text) params.set(key, text);
  }
  return params.toString();
}

export const activeFilterCount = (filters) => FILTER_KEYS.filter((key) => String(filters[key] ?? "").trim()).length;

export function describeFilters(filters, formatDate) {
  const f = Object.fromEntries(FILTER_KEYS.map((key) => [key, String(filters[key] ?? "").trim()]));
  if (!FILTER_KEYS.some((key) => f[key])) return "All calls in the database.";

  const kinds = [
    f.direction && (f.direction === "inbound" ? "incoming" : "outgoing"),
    f.status && (f.status === "successful" ? "successful" : "failed"),
  ].filter(Boolean);
  const parts = [kinds.length ? `${kinds.join(", ")} calls` : "calls"];

  if (f.from && f.to) parts.push(`from ${formatDate(f.from)} to ${formatDate(f.to)}`);
  else if (f.from) parts.push(`from ${formatDate(f.from)} onwards`);
  else if (f.to) parts.push(`up to ${formatDate(f.to)}`);
  if (f.city) parts.push(`in cities matching "${f.city}"`);
  if (f.callerNumber) parts.push(`made from numbers containing ${f.callerNumber}`);
  if (f.receiverNumber) parts.push(`made to numbers containing ${f.receiverNumber}`);

  const [first, ...rest] = parts;
  const text = rest.length ? `${first} ${rest.join(", ")}` : first;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}
