import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { topBy } from "@/lib/analytics";
import { formatCurrency, formatCurrencyShort } from "@/lib/format";
import { COLORS, ChartTooltip, EmptyChart, axisProps } from "./chart-style";

export function CostChart({ cities, summary }) {
  const data = topBy(cities, "cost", 10);
  const priciest = data[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call cost by city</CardTitle>
        <CardDescription>Top 10 cities by total spend</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 border-b pb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Average per call</p>
            <p className="font-serif text-xl tabular-nums">{formatCurrency(summary.averageCost)}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Highest spend</p>
            <p className="truncate font-serif text-xl" title={priciest?.city}>
              {priciest ? priciest.city : "-"}
            </p>
          </div>
        </div>
        <div className="h-72">
          {data.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis type="number" {...axisProps} tickFormatter={formatCurrencyShort} />
                <YAxis type="category" dataKey="city" {...axisProps} width={100} interval={0} />
                <Tooltip cursor={{ fill: COLORS.hover }} content={<ChartTooltip formatValue={formatCurrency} />} />
                <Bar dataKey="cost" name="Total cost" fill={COLORS.ochre} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
