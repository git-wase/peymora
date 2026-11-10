"use client";

import { track } from "@/lib/track";
import { useEffect, useRef, type ReactNode } from "react";

export function Seen({ name, children }: { name: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        track(name);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [name]);

  return <div ref={ref}>{children}</div>;
}

export function TrackOnce({ name }: { name: string }) {
  useEffect(() => {
    const key = `vela-tracked:${name}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // If storage is blocked, still send the event once for this mount.
    }
    track(name);
  }, [name]);
  return null;
}
