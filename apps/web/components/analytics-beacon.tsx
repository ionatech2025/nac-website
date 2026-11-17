"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function shouldSkip(pathname: string): boolean {
  if (pathname.startsWith("/admin")) return true;
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname.includes("complaint")) return true;
  return false;
}

/** Lightweight first-party page-view beacon (AD-B8-01). No cookies. */
export function AnalyticsBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string>("");

  useEffect(() => {
    if (!pathname || shouldSkip(pathname)) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });

    const url = "/api/analytics/view";
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
