import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatCurrency, formatDateTime, formatDuration, formatNumber } from "@/lib/format";
import { toQueryString } from "@/lib/filters";

const PAGE_SIZE = 20;

const COLUMNS = [
  { key: "callerName", label: "Caller Name", sortable: true },
  { key: "callerNumber", label: "Caller Number" },
  { key: "receiverNumber", label: "Receiver Number" },
  { key: "city", label: "City", sortable: true },
  { key: "duration", label: "Duration", sortable: true, align: "right" },
  { key: "cost", label: "Cost", sortable: true, align: "right" },
  { key: "startTime", label: "Start Time", sortable: true },
];

// server-side paging, sorting and filtering
export function CallLogTable({ filters }) {
  const filterQuery = toQueryString(filters);
  const [sort, setSort] = useState({ key: "startTime", order: "desc" });
  // back to page 1 when the filters change
  const [pageState, setPageState] = useState({ filterQuery, page: 1 });
  const page = pageState.filterQuery === filterQuery ? pageState.page : 1;
  const setPage = (next) => setPageState({ filterQuery, page: next });

  const [result, setResult] = useState({ data: [], pagination: null, status: "loading", error: null });

  useEffect(() => {
    const controller = new AbortController();
    setResult((current) => ({ ...current, status: "loading", error: null }));
    const query = toQueryString(filters, { page, limit: PAGE_SIZE, sort: sort.key, order: sort.order });
    api
      .calls(query, controller.signal)
      .then(({ data, pagination }) => setResult({ data, pagination, status: "ready", error: null }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setResult((current) => ({ ...current, status: "error", error: error.message }));
      });
    return () => controller.abort();
  }, [filterQuery, page, sort]);

  function toggleSort(key) {
    setSort((current) =>
      current.key === key ? { key, order: current.order === "asc" ? "desc" : "asc" } : { key, order: key === "startTime" ? "desc" : "asc" }
    );
    setPage(1);
  }

  const { data, pagination, status, error } = result;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const firstShown = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = (page - 1) * PAGE_SIZE + data.length;

  return (
    <div>
      {status === "error" && (
        <p role="alert" className="mb-4 border border-destructive/40 px-4 py-2 text-sm text-destructive">
          Couldn't load call records: {error}
        </p>
      )}
      <div className={status === "loading" && pagination ? "opacity-60 transition-opacity" : undefined} aria-busy={status === "loading"}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {COLUMNS.map((column) => {
                const active = sort.key === column.key;
                return (
                  <TableHead
                    key={column.key}
                    className={column.align === "right" ? "text-right" : undefined}
                    aria-sort={active ? (sort.order === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {column.sortable ? (
                      <button type="button" onClick={() => toggleSort(column.key)}
                        className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {column.label}
                        <span aria-hidden="true" className="text-xs">{active ? (sort.order === "asc" ? "▲" : "▼") : ""}</span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-muted-foreground">
                  {status === "loading" ? "Loading calls..." : "No calls match these filters."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.callerName}</TableCell>
                  <TableCell className="tabular-nums">{call.callerNumber}</TableCell>
                  <TableCell className="tabular-nums">{call.receiverNumber}</TableCell>
                  <TableCell>{call.city}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatDuration(call.durationSeconds)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(call.cost)}</TableCell>
                  <TableCell className="tabular-nums">{formatDateTime(call.startTime)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="tabular-nums">
          Showing {formatNumber(firstShown)} to {formatNumber(lastShown)} of {formatNumber(totalItems)} calls
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1 || status === "loading"} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="tabular-nums">
            Page {formatNumber(page)} of {formatNumber(totalPages)}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages || status === "loading"} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
