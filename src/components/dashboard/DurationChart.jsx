import { formatDuration } from "@/lib/format";
import { BarList } from "./BarList";
import { COLORS } from "./chart-style";
import { Section } from "./Section";

export function DurationChart({ durations, summary }) {
  const { longest, shortest } = durations;
  const items = [
    longest && { key: "longest", label: "Longest", value: longest.durationSeconds, display: formatDuration(longest.durationSeconds) },
    { key: "average", label: "Average", value: summary.averageDurationSeconds, display: formatDuration(summary.averageDurationSeconds) },
    shortest && { key: "shortest", label: "Shortest", value: shortest.durationSeconds, display: formatDuration(shortest.durationSeconds) },
  ].filter(Boolean);

  const note = longest
    ? `The longest call was made by ${longest.callerName}; the shortest by ${shortest.callerName}.`
    : undefined;

  return (
    <Section title="Call length" note={note}>
      <BarList items={summary.totalCalls ? items : []} color={COLORS.primary} label="Longest, average and shortest call" />
    </Section>
  );
}
