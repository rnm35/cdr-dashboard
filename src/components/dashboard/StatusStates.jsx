import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";

function Block({ className = "" }) {
  return <div className={`animate-pulse border bg-muted ${className}`} />;
}

export function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading call data">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Block key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Block className="h-96 lg:col-span-2" />
        <Block className="h-96" />
      </div>
      <Block className="h-96" />
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Couldn't load the call data</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Check your internet connection, then try again. The data comes from{" "}
          <span className="break-all text-muted-foreground">{API_URL}</span>
        </p>
        <Button onClick={onRetry}>Try again</Button>
      </CardContent>
    </Card>
  );
}
