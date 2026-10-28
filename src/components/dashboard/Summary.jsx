import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatDuration, formatNumber, formatPercent } from "@/lib/format";

const Figure = ({ children }) => <strong className="font-normal text-primary tabular-nums">{children}</strong>;

export function Summary({ summary: s }) {
  const calls = s.totalCalls === 1 ? "call" : "calls";
  const sameDay = s.firstCall && formatDate(s.firstCall) === formatDate(s.lastCall);

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <p className="font-serif text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">
          <Figure>{formatNumber(s.totalCalls)}</Figure> {calls}
          {s.firstCall && (sameDay ? <> on {formatDate(s.firstCall)}</> : <> between {formatDate(s.firstCall)} and {formatDate(s.lastCall)}</>)}{" "}
          lasted <Figure>{formatDuration(s.totalDurationSeconds)}</Figure> in total, an average of{" "}
          <Figure>{formatDuration(s.averageDurationSeconds)}</Figure> each, and cost{" "}
          <Figure>{formatCurrency(s.totalCost)}</Figure> ({formatCurrency(s.averageCost)} per call).{" "}
          <Figure>{formatNumber(s.successfulCalls)}</Figure> connected and{" "}
          <Figure>{formatNumber(s.failedCalls)}</Figure> failed, a {formatPercent(s.successRate)} success rate.
        </p>
      </CardContent>
    </Card>
  );
}
