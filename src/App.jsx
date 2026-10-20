import { useMemo } from "react";
import { CallLogTable } from "@/components/dashboard/CallLogTable";
import { CityChart } from "@/components/dashboard/CityChart";
import { CostChart } from "@/components/dashboard/CostChart";
import { DurationChart } from "@/components/dashboard/DurationChart";
import { Header } from "@/components/dashboard/Header";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { ErrorState, LoadingState } from "@/components/dashboard/StatusStates";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { useCallData } from "@/hooks/useCallData";
import { useTheme } from "@/hooks/useTheme";
import { cityStats, summarise } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { calls, status, error, updatedAt, reload } = useCallData();

  const summary = useMemo(() => summarise(calls), [calls]);
  const cities = useMemo(() => cityStats(calls), [calls]);

  // Keep showing the old numbers while a refresh is in progress
  const hasData = calls.length > 0;

  return (
    <div id="top" className="min-h-screen">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={reload}
        loading={status === "loading"}
        updatedAt={updatedAt}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl">Call Data Record Analysis</h1>
          <p className="text-muted-foreground">
            {hasData
              ? `Activity, cost and outcomes for ${formatNumber(summary.total)} calls from the CDR API.`
              : "Activity, cost and outcomes for calls from the CDR API."}
          </p>
        </div>

        {status === "error" && !hasData && <ErrorState message={error} onRetry={reload} />}
        {status === "loading" && !hasData && <LoadingState />}

        {hasData && (
          <>
            {status === "error" && (
              <p className="border border-destructive/40 px-4 py-2 text-sm text-destructive">
                Refresh failed: {error} Showing the last data that loaded.
              </p>
            )}

            <section aria-label="Key metrics">
              <KpiCards summary={summary} />
            </section>

            <section className="grid gap-6 lg:grid-cols-3" aria-label="Call activity">
              <TimelineChart calls={calls} />
              <StatusChart summary={summary} />
            </section>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Duration, cost and city analytics">
              <DurationChart calls={calls} summary={summary} />
              <CostChart cities={cities} summary={summary} />
              <div className="md:col-span-2 lg:col-span-1">
                <CityChart cities={cities} />
              </div>
            </section>

            <section aria-label="Call logs">
              <CallLogTable calls={calls} />
            </section>
          </>
        )}
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-5 text-sm text-muted-foreground">
          <p>© 2026 Manraj Sandhu</p>
          <p>Built with React, Tailwind CSS, shadcn/ui and Recharts</p>
        </div>
      </footer>
    </div>
  );
}
