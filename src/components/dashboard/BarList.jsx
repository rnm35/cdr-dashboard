// plain html bar chart
export function BarList({ items, color, label }) {
  const max = Math.max(0, ...items.map((item) => item.value));
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Nothing to show for these filters.</p>;

  return (
    <ul className="space-y-2" aria-label={label}>
      {items.map((item) => (
        <li key={item.key} className="grid grid-cols-[minmax(0,8.5rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate" title={item.label}>
            {item.label}
          </span>
          <span className="h-2.5 bg-muted" aria-hidden="true">
            <span className="block h-full" style={{ width: `${max ? (item.value / max) * 100 : 0}%`, background: color }} />
          </span>
          <span className="text-right tabular-nums">{item.display}</span>
        </li>
      ))}
    </ul>
  );
}
