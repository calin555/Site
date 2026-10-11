"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { HeaderState } from "@/lib/header-state/types";

const EVENT = "header-state:refresh";

/** Cere header-ului să reîncarce coșul / sesiunea (după add-to-cart, login, logout etc.). */
export function refreshHeaderState(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

const EMPTY: HeaderState = { cartCount: 0, user: null };

/**
 * Starea personalizată a header-ului, încărcată pe client din /api/header-state,
 * ca layout-ul magazinului să nu citească cookie-uri (altfel toate paginile ar fi dinamice).
 * Se reîncarcă la schimbarea paginii, la revenirea în tab și la refreshHeaderState().
 */
export function useHeaderState(): HeaderState & { loaded: boolean } {
  const pathname = usePathname();
  const [state, setState] = useState<HeaderState>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/header-state", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) return;
      const data = (await res.json()) as HeaderState;
      setState({
        cartCount: data.cartCount ?? 0,
        user: data.user ?? null,
        accountCounts: data.accountCounts,
      });
    } catch {
      // rețea indisponibilă — păstrăm starea curentă
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, pathname]);

  useEffect(() => {
    const onRefresh = () => void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener(EVENT, onRefresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(EVENT, onRefresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { ...state, loaded };
}
