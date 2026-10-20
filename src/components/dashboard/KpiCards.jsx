import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatDuration, formatNumber, formatPercent } from "@/lib/format";

function KpiCard({ label, value, detail }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-3xl tabular-nums">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function KpiCards({ summary }) {
  const { total, totalCost, averageCost, averageDuration, successful, failed, inbound, outbound } = summary;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCard
        label="Total calls"
        value={formatNumber(total)}
        detail={`${formatNumber(inbound)} inbound, ${formatNumber(outbound)} outbound`}
      />
      <KpiCard
        label="Total call cost"
        value={formatCurrency(totalCost)}
        detail={`${formatCurrency(averageCost)} per call on average`}
      />
      <KpiCard
        label="Average call duration"
        value={formatDuration(averageDuration)}
        detail={`${formatNumber(Math.round(averageDuration))} seconds`}
      />
      <KpiCard
        label="Successful calls"
        value={formatNumber(successful)}
        detail={`${formatPercent(successful, total)} success rate`}
      />
      <KpiCard
        label="Failed calls"
        value={formatNumber(failed)}
        detail={`${formatPercent(failed, total)} of all calls`}
      />
    </div>
  );
}
