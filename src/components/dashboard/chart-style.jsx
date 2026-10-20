// shared recharts settings so every chart uses the theme colours and the same tooltip

export const COLORS = {
  primary: "hsl(var(--chart-1))",
  ochre: "hsl(var(--chart-2))",
  slate: "hsl(var(--chart-3))",
  red: "hsl(var(--chart-4))",
  grid: "hsl(var(--border))",
  text: "hsl(var(--muted-foreground))",
  hover: "hsl(var(--muted))",
};

export const axisProps = {
  stroke: COLORS.grid,
  tick: { fill: COLORS.text, fontSize: 12 },
  tickLine: false,
};

export function ChartTooltip({ active, payload, label, formatValue = (value) => value, formatLabel }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="border bg-card px-3 py-2 text-sm">
      <p className="mb-1 font-medium">{formatLabel ? formatLabel(label, payload) : label}</p>
      {payload.map((item) => (
        <p key={item.dataKey ?? item.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block h-2 w-2" style={{ background: item.color || item.payload?.fill }} />
          {item.name}: <span className="tabular-nums text-foreground">{formatValue(item.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function EmptyChart({ message = "No calls to show." }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{message}</div>
  );
}
