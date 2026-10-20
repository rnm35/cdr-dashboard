import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatDuration, formatNumber } from "@/lib/format";

const PAGE_SIZE = 10;

export function CallLogTable({ calls }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  // Most recent calls first
  const sorted = useMemo(() => [...calls].sort((a, b) => b.start - a.start), [calls]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sorted;
    return sorted.filter((call) =>
      [call.callerName, call.callerNumber, call.receiverNumber, call.city].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }, [sorted, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const firstShown = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const lastShown = currentPage * PAGE_SIZE + rows.length;

  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Recent call logs</CardTitle>
          <CardDescription>Every call record, newest first</CardDescription>
        </div>
        <label className="w-full sm:w-64">
          <span className="sr-only">Search calls</span>
          <Input
            id="call-search"
            type="search"
            placeholder="Search name, number or city"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
      </CardHeader>
      <CardContent className="px-0 sm:px-5">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Caller Name</TableHead>
              <TableHead>Caller Number</TableHead>
              <TableHead>Receiver Number</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No calls match "{query}".
                </TableCell>
              </TableRow>
            ) : (
              rows.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.callerName}</TableCell>
                  <TableCell className="tabular-nums">{call.callerNumber}</TableCell>
                  <TableCell className="tabular-nums">{call.receiverNumber}</TableCell>
                  <TableCell>{call.city}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatDuration(call.duration)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(call.cost)}</TableCell>
                  <TableCell className="tabular-nums">{formatDateTime(call.start)}</TableCell>
                  <TableCell>
                    <Badge variant={call.successful ? "success" : "destructive"}>
                      {call.successful ? "Successful" : "Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-5 text-sm text-muted-foreground sm:px-0">
          <p className="tabular-nums">
            Showing {formatNumber(firstShown)} to {formatNumber(lastShown)} of {formatNumber(filtered.length)} calls
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
