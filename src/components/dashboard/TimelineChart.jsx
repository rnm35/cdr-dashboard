import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { callsByHour, callsOverTime } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";
import { COLORS, ChartTooltip, EmptyChart, axisProps } from "./chart-style";

export function TimelineChart({ calls }) {
  const [view, setView] = useState("date");

  const overTime = callsOverTime(calls);
  const data = view === "date" ? overTime.points : callsByHour(calls);
  const description =
    view === "date"
      ? `Number of calls per ${overTime.unit}, based on start time`
      : "Number of calls by the time of day they started";

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Call activity</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-2" role="group" aria-label="Group calls by">
          <Button
            size="sm"
            variant={view === "date" ? "active" : "outline"}
            aria-pressed={view === "date"}
            onClick={() => setView("date")}
          >
            By {overTime.unit}
          </Button>
          <Button
            size="sm"
            variant={view === "hour" ? "active" : "outline"}
            aria-pressed={view === "hour"}
            onClick={() => setView("hour")}
          >
            Time of day
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="label" {...axisProps} minTickGap={16} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip formatValue={formatNumber} />} />
                <Line
                  type="monotone"
                  dataKey="calls"
                  name="Calls"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={data.length <= 36 ? { r: 3, fill: COLORS.primary } : false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
