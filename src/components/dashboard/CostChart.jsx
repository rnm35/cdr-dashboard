import { formatCurrency } from "@/lib/format";
import { BarList } from "./BarList";
import { COLORS } from "./chart-style";
import { Section } from "./Section";

export function CostChart({ cities, summary }) {
  const items = cities.byCost.map((city) => ({
    key: city.city,
    label: city.city,
    value: city.totalCost,
    display: formatCurrency(city.totalCost),
  }));

  return (
    <Section title="Cost by city" note={`Calls cost ${formatCurrency(summary.averageCost)} on average. These cities spent the most in total.`}>
      <BarList items={items} color={COLORS.ochre} label="Total call cost by city" />
    </Section>
  );
}
