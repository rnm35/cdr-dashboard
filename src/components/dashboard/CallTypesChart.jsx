import { formatNumber, formatPercent } from "@/lib/format";
import { COLORS } from "./chart-style";
import { Section } from "./Section";

const TYPES = {
  inbound: { label: "Incoming", color: COLORS.primary },
  outbound: { label: "Outgoing", color: COLORS.ochre },
};

export function CallTypesChart({ callTypes }) {
  const total = callTypes.reduce((sum, type) => sum + type.calls, 0);
  const description = callTypes.map((type) => `${formatPercent(type.percentage)} ${TYPES[type.type].label.toLowerCase()}`).join(", ");

  return (
    <Section title="Incoming and outgoing" note={total ? `${description}.` : undefined}>
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show for these filters.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex h-4 w-full" role="img" aria-label={description}>
            {callTypes.map((type) => (
              <div key={type.type} style={{ width: `${type.percentage}%`, background: TYPES[type.type].color }} />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
            {callTypes.map((type) => (
              <li key={type.type} className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5" style={{ background: TYPES[type.type].color }} aria-hidden="true" />
                {TYPES[type.type].label}
                <span className="tabular-nums text-muted-foreground">
                  {formatNumber(type.calls)} ({formatPercent(type.percentage)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
