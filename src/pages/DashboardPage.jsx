import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CallLogTable } from "@/components/dashboard/CallLogTable";
import { CallTypesChart } from "@/components/dashboard/CallTypesChart";
import { CityChart } from "@/components/dashboard/CityChart";
import { CostChart } from "@/components/dashboard/CostChart";
import { DurationChart } from "@/components/dashboard/DurationChart";
import { Section } from "@/components/dashboard/Section";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { EmptyState, ErrorState, LoadingState } from "@/components/dashboard/StatusStates";
import { Summary } from "@/components/dashboard/Summary";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { TopCallers } from "@/components/dashboard/TopCallers";
import { UsersCard } from "@/components/dashboard/UsersCard";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useTheme } from "@/hooks/useTheme";
import { EMPTY_FILTERS, describeFilters, readFilters, toQueryString } from "@/lib/filters";
import { formatDate } from "@/lib/format";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user.role === "admin";

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const setFilters = useCallback(
    (next) => setSearchParams(new URLSearchParams(toQueryString(next)), { replace: true }),
    [setSearchParams]
  );

  const { data, status, error, reload } = useDashboard(toQueryString(filters));
  const noResults = data && data.summary.totalCalls === 0;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <Sidebar
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSignOut={logout}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-2">
            <h1 className="text-4xl sm:text-5xl">Call report</h1>
            <p className="text-muted-foreground">{describeFilters(filters, formatDate)}</p>
          </header>

          {status === "error" && !data && <ErrorState message={error} onRetry={reload} />}
          {status === "loading" && !data && <LoadingState />}

          {data && (
            <div className={status === "loading" ? "space-y-10 opacity-60 transition-opacity" : "space-y-10"} aria-busy={status === "loading"}>
              {status === "error" && (
                <p role="alert" className="border border-destructive/40 px-4 py-2 text-sm text-destructive">
                  Couldn't update: {error} Showing the last results that loaded.
                </p>
              )}

              {noResults ? (
                <EmptyState onClear={() => setFilters(EMPTY_FILTERS)} />
              ) : (
                <>
                  <Summary summary={data.summary} />
                  <TimelineChart timeline={data.timeline} />
                  <CallTypesChart callTypes={data.callTypes} />
                  <Section title="Callers and cities">
                    <div className="grid gap-8 md:grid-cols-2">
                      <TopCallers callers={data.topCallers} isAdmin={isAdmin} />
                      <CityChart cities={data.cities} />
                    </div>
                  </Section>
                  <DurationChart durations={data.durations} summary={data.summary} />
                  <CostChart cities={data.cities} summary={data.summary} />
                </>
              )}
            </div>
          )}

          <Section
            title="Call records"
            note={
              isAdmin
                ? "Every call matching the filters. Select a column heading to sort."
                : "Individual records include full phone numbers, so they're only available to admins."
            }
          >
            {isAdmin && <CallLogTable filters={filters} />}
          </Section>

          {isAdmin && (
            <Section title="Access" note="Admins see everything, including call records. Analysts see the analytics above only.">
              <UsersCard currentUserId={user.id} />
            </Section>
          )}

          <footer className="border-t pt-6 text-sm text-muted-foreground">
            © 2026 Manraj Sandhu. Built with React, Express and PostgreSQL.
          </footer>
        </div>
      </main>
    </div>
  );
}
