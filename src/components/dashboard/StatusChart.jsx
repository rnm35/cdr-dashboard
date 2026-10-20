import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/format";
import { COLORS, ChartTooltip } from "./chart-style";

export function StatusChart({ summary }) {
  const { total, successful, failed, inbound, outbound } = summary;
  const data = [
    { name: "Successful", value: successful, fill: COLORS.primary },
    { name: "Failed", value: failed, fill: COLORS.red },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call outcomes</CardTitle>
        <CardDescription>Successful and failed calls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="90%"
                stroke="hsl(var(--card))"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((slice) => (
                  <Cell key={slice.name} fill={slice.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatValue={formatNumber} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl tabular-nums">{formatPercent(successful, total)}</span>
            <span className="text-xs text-muted-foreground">success rate</span>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          {data.map((slice) => (
            <div key={slice.name} className="flex items-center justify-between">
              <dt className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5" style={{ background: slice.fill }} />
                {slice.name}
              </dt>
              <dd className="tabular-nums">{formatNumber(slice.value)}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2 text-muted-foreground">
            <dt>Inbound / outbound</dt>
            <dd className="tabular-nums">
              {formatNumber(inbound)} / {formatNumber(outbound)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
