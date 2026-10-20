import { useCallback, useEffect, useState } from "react";
import { fetchCalls } from "@/lib/api";

export function useCallData() {
  const [calls, setCalls] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetchCalls(controller.signal)
      .then((data) => {
        setCalls(data);
        setUpdatedAt(new Date());
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong while loading the call data.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [requestId]);

  const reload = useCallback(() => setRequestId((id) => id + 1), []);

  return { calls, status, error, updatedAt, reload };
}
