import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { durationBuckets } from "@/lib/analytics";
import { formatDuration, formatNumber } from "@/lib/format";
import { COLORS, ChartTooltip, EmptyChart, axisProps } from "./chart-style";

function Stat({ label, value, detail }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-serif text-xl tabular-nums">{value}</p>
      <p className="truncate text-xs text-muted-foreground" title={detail}>
        {detail}
      </p>
    </div>
  );
}

export function DurationChart({ calls, summary }) {
  const buckets = durationBuckets(calls);
  const { longest, shortest, averageDuration } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call duration</CardTitle>
        <CardDescription>How long calls last, grouped into equal ranges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3 border-b pb-4">
          <Stat
            label="Longest"
            value={longest ? formatDuration(longest.duration) : "-"}
            detail={longest?.callerName ?? ""}
          />
          <Stat
            label="Shortest"
            value={shortest ? formatDuration(shortest.duration) : "-"}
            detail={shortest?.callerName ?? ""}
          />
          <Stat label="Average" value={formatDuration(averageDuration)} detail="across all calls" />
        </div>
        <div className="h-60">
          {buckets.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buckets} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="label" {...axisProps} tick={{ ...axisProps.tick, fontSize: 11 }} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: COLORS.hover }}
                  content={
                    <ChartTooltip
                      formatValue={formatNumber}
                      formatLabel={(_, payload) => {
                        const bucket = payload[0]?.payload;
                        return bucket
                          ? `${formatDuration(bucket.lower)} to ${formatDuration(bucket.upper)}`
                          : "";
                      }}
                    />
                  }
                />
                <Bar dataKey="calls" name="Calls" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
