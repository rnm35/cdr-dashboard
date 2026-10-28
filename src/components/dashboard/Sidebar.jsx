import { useState } from "react";
import { Button } from "@/components/ui/button";
import { activeFilterCount } from "@/lib/filters";
import { FilterBar } from "./FilterBar";

export function Sidebar({ user, theme, onToggleTheme, onSignOut, filters, onFiltersChange }) {
  // filters collapse on small screens
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(filters);

  return (
    <div className="flex h-full flex-col gap-6 px-5 py-6">
      <div className="space-y-1">
        <p className="font-serif text-xl">Call Analytics</p>
        <p className="text-sm text-muted-foreground">
          {user.name}, {user.role === "admin" ? "admin" : "analyst"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Filters{count > 0 && ` (${count})`}
          </h2>
          <Button size="sm" variant="ghost" className="lg:hidden" aria-expanded={open} aria-controls="filter-panel"
            onClick={() => setOpen((value) => !value)}>
            {open ? "Hide" : "Show"}
          </Button>
        </div>
        <div id="filter-panel" className={open ? "block" : "hidden lg:block"}>
          <FilterBar value={filters} onChange={onFiltersChange} />
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
        <Button size="sm" variant="outline" onClick={onToggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <Button size="sm" variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
