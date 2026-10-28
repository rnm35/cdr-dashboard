import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { EMPTY_FILTERS, FILTER_KEYS, activeFilterCount } from "@/lib/filters";

const DEBOUNCE_MS = 400;

// compare trimmed values so typing a space doesn't reset the input
const sameFilters = (a, b) =>
  FILTER_KEYS.every((key) => String(a[key] ?? "").trim() === String(b[key] ?? "").trim());

function Field({ id, label, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

// debounced so typing doesn't send a request per keystroke
export function FilterBar({ value, onChange }) {
  const [draft, setDraft] = useState(value);
  const dateError = draft.from && draft.to && draft.from > draft.to ? "The start date is after the end date." : null;

  // sync when the filters change elsewhere (clear, back button)
  useEffect(() => {
    setDraft((current) => (sameFilters(current, value) ? current : value));
  }, [value]);

  useEffect(() => {
    if (dateError || sameFilters(draft, value)) return;
    const timer = setTimeout(() => onChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, value, onChange, dateError]);

  const update = (event) => setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()} aria-label="Filter calls">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-medium">Date (UTC)</legend>
        <Field id="filter-from" label="From">
          <Input id="filter-from" name="from" type="date" value={draft.from} onChange={update} />
        </Field>
        <Field id="filter-to" label="To">
          <Input id="filter-to" name="to" type="date" value={draft.to} onChange={update}
            aria-invalid={Boolean(dateError)} aria-describedby={dateError ? "filter-date-error" : undefined} />
        </Field>
        {dateError && (
          <p id="filter-date-error" className="text-sm text-destructive">
            {dateError}
          </p>
        )}
      </fieldset>

      <Field id="filter-direction" label="Direction">
        <NativeSelect id="filter-direction" name="direction" value={draft.direction} onChange={update}>
          <option value="">Incoming and outgoing</option>
          <option value="inbound">Incoming only</option>
          <option value="outbound">Outgoing only</option>
        </NativeSelect>
      </Field>
      <Field id="filter-status" label="Outcome">
        <NativeSelect id="filter-status" name="status" value={draft.status} onChange={update}>
          <option value="">Any outcome</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
        </NativeSelect>
      </Field>
      <Field id="filter-city" label="City contains">
        <Input id="filter-city" name="city" value={draft.city} onChange={update} />
      </Field>
      <Field id="filter-caller" label="Caller number contains">
        <Input id="filter-caller" name="callerNumber" inputMode="tel" value={draft.callerNumber} onChange={update} />
      </Field>
      <Field id="filter-receiver" label="Receiver number contains">
        <Input id="filter-receiver" name="receiverNumber" inputMode="tel" value={draft.receiverNumber} onChange={update} />
      </Field>

      {activeFilterCount(value) > 0 && (
        <Button size="sm" variant="outline" className="w-full" onClick={() => onChange(EMPTY_FILTERS)}>
          Clear filters
        </Button>
      )}
    </form>
  );
}
