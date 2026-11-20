import { useCallback, useEffect, useState } from "react";
import { getAnalytics } from "../lib/api";
import { getErrorMessage } from "../lib/format";

export default function useAnalytics(days) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextData = await getAnalytics(days);
      setData(nextData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const nextData = await getAnalytics(days);
        if (active) setData(nextData);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [days]);

  return { data, loading, error, reload: load };
}
