import { formatNumber } from "@/lib/format";
import { BarList } from "./BarList";
import { COLORS } from "./chart-style";

export function CityChart({ cities }) {
  const items = cities.byCalls.map((city) => ({
    key: city.city,
    label: city.city,
    value: city.calls,
    display: formatNumber(city.calls),
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg">Where from</h3>
        <p className="text-sm text-muted-foreground">
          Cities with the most calls, out of {formatNumber(cities.distinctCities)} in total.
        </p>
      </div>
      <BarList items={items} color={COLORS.slate} label="Number of calls by city" />
    </div>
  );
}
