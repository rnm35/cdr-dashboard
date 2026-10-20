// pure functions that turn the list of calls into the numbers each chart needs

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const sum = (values) => values.reduce((total, value) => total + value, 0);

export function summarise(calls) {
  const total = calls.length;
  const totalCost = sum(calls.map((call) => call.cost));
  const totalDuration = sum(calls.map((call) => call.duration));
  const successful = calls.filter((call) => call.successful).length;
  const inbound = calls.filter((call) => call.inbound).length;

  let longest = null;
  let shortest = null;
  for (const call of calls) {
    if (!longest || call.duration > longest.duration) longest = call;
    if (!shortest || call.duration < shortest.duration) shortest = call;
  }

  return {
    total,
    totalCost,
    averageCost: total ? totalCost / total : 0,
    averageDuration: total ? totalDuration / total : 0,
    successful,
    failed: total - successful,
    inbound,
    outbound: total - inbound,
    longest,
    shortest,
  };
}

// Splits call durations into equal-width ranges for the histogram
export function durationBuckets(calls, bucketCount = 6) {
  if (calls.length === 0) return [];
  const durations = calls.map((call) => call.duration);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const width = Math.max(1, Math.ceil((max - min + 1) / bucketCount));

  const buckets = [];
  for (let lower = min; lower <= max; lower += width) {
    const upper = lower + width - 1;
    buckets.push({ label: `${lower}-${upper}s`, lower, upper, calls: 0 });
  }
  for (const duration of durations) {
    const index = Math.min(buckets.length - 1, Math.floor((duration - min) / width));
    buckets[index].calls += 1;
  }
  return buckets;
}

// one row per city with its call count, total cost and average cost
export function cityStats(calls) {
  const byCity = new Map();
  for (const call of calls) {
    const row = byCity.get(call.city) ?? { city: call.city, calls: 0, cost: 0 };
    row.calls += 1;
    row.cost += call.cost;
    byCity.set(call.city, row);
  }
  return [...byCity.values()].map((row) => ({
    ...row,
    cost: Math.round(row.cost * 100) / 100,
    averageCost: row.cost / row.calls,
  }));
}

export function topBy(rows, key, count = 10) {
  return [...rows].sort((a, b) => b[key] - a[key] || a.city.localeCompare(b.city)).slice(0, count);
}

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Calls over time, with empty slots filled in so the line doesn't skip gaps
//  grouping depends on how much time the data covers
// up to 3 days -> per hour, up to about 3 months -> per day, longer -> per month
export function callsOverTime(calls) {
  if (calls.length === 0) return { unit: "day", points: [] };

  const times = calls.map((call) => call.start.getTime());
  const earliest = Math.min(...times);
  const latest = Math.max(...times);

  if (latest - earliest <= 3 * DAY_MS) {
    const firstHour = new Date(earliest);
    firstHour.setMinutes(0, 0, 0);
    const points = [];
    for (let t = firstHour.getTime(); t <= latest; t += HOUR_MS) {
      const hour = new Date(t);
      points.push({
        key: t,
        label: `${hour.getDate()} ${MONTHS[hour.getMonth()]} ${String(hour.getHours()).padStart(2, "0")}:00`,
        calls: 0,
        cost: 0,
      });
    }
    for (const call of calls) {
      const row = points[Math.floor((call.start.getTime() - firstHour.getTime()) / HOUR_MS)];
      row.calls += 1;
      row.cost += call.cost;
    }
    return { unit: "hour", points };
  }

  const first = startOfDay(new Date(earliest));
  const last = startOfDay(new Date(latest));
  const spanDays = Math.round((last - first) / DAY_MS) + 1;

  if (spanDays > 92) {
    const byMonth = new Map();
    for (const call of calls) {
      const key = `${call.start.getFullYear()}-${String(call.start.getMonth()).padStart(2, "0")}`;
      const row = byMonth.get(key) ?? {
        key,
        label: `${MONTHS[call.start.getMonth()]} ${call.start.getFullYear()}`,
        calls: 0,
        cost: 0,
      };
      row.calls += 1;
      row.cost += call.cost;
      byMonth.set(key, row);
    }
    const points = [...byMonth.values()].sort((a, b) => a.key.localeCompare(b.key));
    return { unit: "month", points };
  }

  const byDay = new Map();
  for (let i = 0; i < spanDays; i += 1) {
    const day = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
    byDay.set(dayKey(day), {
      key: dayKey(day),
      label: `${day.getDate()} ${MONTHS[day.getMonth()]}`,
      calls: 0,
      cost: 0,
    });
  }
  for (const call of calls) {
    const row = byDay.get(dayKey(call.start));
    if (row) {
      row.calls += 1;
      row.cost += call.cost;
    }
  }
  return { unit: "day", points: [...byDay.values()] };
}

// Calls grouped by the hour of the day they started (00:00 to 23:00)
export function callsByHour(calls) {
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    key: hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    calls: 0,
    cost: 0,
  }));
  for (const call of calls) {
    const row = hours[call.start.getHours()];
    row.calls += 1;
    row.cost += call.cost;
  }
  return hours;
}
