import { useCallback, useEffect, useState } from "react";
import { getBills } from "../lib/api";
import { getErrorMessage } from "../lib/format";

export default function useBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextBills = await getBills();
      setBills(Array.isArray(nextBills) ? nextBills : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const nextBills = await getBills();
        if (active) setBills(Array.isArray(nextBills) ? nextBills : []);
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
  }, []);

  return { bills, loading, error, reload: load };
}
