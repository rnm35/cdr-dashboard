import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatBucket, formatNumber } from "@/lib/format";
import { COLORS, ChartTooltip, EmptyChart, axisProps } from "./chart-style";
import { Section } from "./Section";

export function TimelineChart({ timeline }) {
  const unit = timeline.interval;
  const data = timeline.points.map((point) => ({ label: formatBucket(point.bucket, unit), calls: point.calls }));

  let note = `Calls per ${unit}, by start time.`;
  if (data.length > 1) {
    const busiest = data.reduce((best, point) => (point.calls > best.calls ? point : best));
    const quietest = data.reduce((low, point) => (point.calls < low.calls ? point : low));
    note = `Calls per ${unit}. Busiest: ${busiest.label} with ${formatNumber(busiest.calls)}. Quietest: ${quietest.label} with ${formatNumber(quietest.calls)}.`;
  }

  return (
    <Section title="Activity" note={note}>
      <div className="h-72">
        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="label" {...axisProps} minTickGap={20} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip content={<ChartTooltip formatValue={formatNumber} />} />
              <Line type="monotone" dataKey="calls" name="Calls" stroke={COLORS.primary} strokeWidth={2}
                dot={data.length <= 36 ? { r: 3, fill: COLORS.primary } : false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Section>
  );
}
