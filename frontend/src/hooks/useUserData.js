import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/** Loads the current user's records + assigned treks from GET /user/?id=. */
export function useUserData() {
  const { user, setUser } = useAuth();
  const [record, setRecord] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await api("get", "/user/", { id: user.id });
    const rec = res?.data?.user || null;
    setRecord(rec);
    setTreks(res?.data?.treks || []);
    setLoading(false);
    // keep the cached balance in the shell topbar fresh
    if (rec) setUser({ ...user, ...rec });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { record, treks, loading, reload: load };
}
