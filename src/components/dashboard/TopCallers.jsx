import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from "@/lib/format";

export function TopCallers({ callers, isAdmin }) {
  // every caller number appears once in this data, so rank by talk time
  const oneCallEach = callers.length > 0 && callers.every((caller) => caller.calls === 1);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg">Who called</h3>
        <p className="text-sm text-muted-foreground">
          Top callers by total talk time{oneCallEach && " (each made one call)"}
          {!isAdmin && ". Numbers are partly hidden for analysts"}.
        </p>
      </div>
      {callers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show for these filters.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-2">Caller</TableHead>
              <TableHead className="px-2">Number</TableHead>
              <TableHead className="px-2 text-right">Talk time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callers.map((caller, index) => (
              <TableRow key={`${index}-${caller.callerNumber}`}>
                <TableCell className="max-w-[10rem] truncate px-2" title={caller.callerName}>{caller.callerName}</TableCell>
                <TableCell className="px-2 tabular-nums text-muted-foreground">{caller.callerNumber}</TableCell>
                <TableCell className="px-2 text-right tabular-nums">{formatDuration(caller.totalDurationSeconds)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
