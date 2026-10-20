import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { topBy } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";
import { COLORS, ChartTooltip, EmptyChart, axisProps } from "./chart-style";

export function CityChart({ cities }) {
  const data = topBy(cities, "calls", 10);
  const busiest = data[0];
  // when every city has the same number of calls, no single city has the most
  const allTied = cities.length > 1 && cities.every((city) => city.calls === busiest.calls);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calls by city</CardTitle>
        <CardDescription>
          {allTied ? "First 10 cities alphabetically" : "Top 10 cities by number of calls"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 border-b pb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cities</p>
            <p className="font-serif text-xl tabular-nums">{formatNumber(cities.length)}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Most calls</p>
            <p className="truncate font-serif text-xl" title={busiest?.city}>
              {!busiest ? "-" : allTied ? "All tied" : `${busiest.city} (${busiest.calls})`}
            </p>
          </div>
        </div>
        {allTied && (
          <p className="text-sm text-muted-foreground">
            Every city in this data has exactly {busiest.calls === 1 ? "one call" : `${busiest.calls} calls`}, so no
            city stands out by volume.
          </p>
        )}
        <div className="h-72">
          {data.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} domain={[0, "dataMax"]} />
                <YAxis type="category" dataKey="city" {...axisProps} width={100} interval={0} />
                <Tooltip cursor={{ fill: COLORS.hover }} content={<ChartTooltip formatValue={formatNumber} />} />
                <Bar dataKey="calls" name="Calls" fill={COLORS.slate} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
