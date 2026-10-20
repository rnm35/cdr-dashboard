import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/format";

export function Header({ theme, onToggleTheme, onRefresh, loading, updatedAt }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <a href="#top" className="font-serif text-lg text-foreground no-underline">
          Call Analytics
        </a>
        <div className="flex items-center gap-2">
          {updatedAt && (
            <span className="hidden text-sm text-muted-foreground sm:inline">Updated {formatTime(updatedAt)}</span>
          )}
          <Button size="sm" variant="outline" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button size="sm" variant="outline" onClick={onToggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </div>
    </header>
  );
}
