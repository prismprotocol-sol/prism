"use client";

import { useEffect, useState } from "react";

function format(date: Date) {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  }).format(date);

  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/New_York",
  }).formatToParts(date);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dateStr = `${get("day")}/${get("month")}/${get("year")}`;

  return `${time} EDT - ${dateStr}`;
}

/** Live technical timestamp, always rendered in US Eastern time. */
export default function Timestamp({ className }: { className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(format(new Date()));
    const id = setInterval(() => setLabel(format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {label ?? "—"}
    </span>
  );
}
