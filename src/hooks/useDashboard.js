import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useDashboard(query) {
  const [state, setState] = useState({ data: null, status: "loading", error: null, updatedAt: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // keep old data visible while reloading
    setState((current) => ({ ...current, status: "loading", error: null }));

    api
      .dashboard(query, controller.signal)
      .then(({ data }) => setState({ data, status: "ready", error: null, updatedAt: new Date() }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState((current) => ({ ...current, status: "error", error: error.message }));
      });

    return () => controller.abort();
  }, [query, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  return { ...state, reload };
}
