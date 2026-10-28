// uk data, so gbp
const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const wholeCurrency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-GB");

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const time = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

export const formatCurrency = (value) => currency.format(value);
export const formatCurrencyShort = (value) => wholeCurrency.format(value);
export const formatNumber = (value) => number.format(value);
export const formatDateTime = (date) => dateTime.format(new Date(date));
export const formatTime = (date) => time.format(date);

// 18 -> "18s", 125 -> "2m 05s", 3725 -> "1h 02m"
export function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) return `${number.format(hours)}h ${String(minutes).padStart(2, "0")}m`;
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

export const formatPercent = (value) => `${Math.round(value)}%`;

const bucketFormats = {
  hour: { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
  day: { day: "numeric", month: "short" },
  week: { day: "numeric", month: "short", year: "2-digit" },
  month: { month: "short", year: "numeric" },
};

export function formatBucket(iso, interval) {
  return new Intl.DateTimeFormat("en-GB", { ...bucketFormats[interval], timeZone: "UTC" }).format(new Date(iso));
}

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const formatDate = (value) => longDate.format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
