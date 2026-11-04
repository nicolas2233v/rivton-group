import { useCallback, useEffect, useState } from "react";

const KEY = "rivton:favorites";
const EVT = "rivton:favorites-change";

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setIds(read());
    setReady(true);
    const sync = () => setIds(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  }, []);
  return { ids, ready, toggle, has: (id: string) => ids.includes(id) };
}
