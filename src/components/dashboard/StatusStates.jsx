import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Block({ className = "" }) {
  return <div className={`animate-pulse bg-muted ${className}`} />;
}

export function LoadingState() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading call data">
      <Block className="h-36 border" />
      <div className="space-y-4 border-t pt-6">
        <Block className="h-7 w-40" />
        <Block className="h-72" />
      </div>
      <div className="space-y-4 border-t pt-6">
        <Block className="h-7 w-56" />
        <Block className="h-4" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Couldn't load the call data</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Try again</Button>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ onClear }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No calls match these filters</CardTitle>
        <CardDescription>Try a wider date range or fewer filters.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
}
