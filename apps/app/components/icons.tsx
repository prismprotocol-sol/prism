type IconProps = { className?: string };

export function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.75" y="1.75" width="5.5" height="5.5" rx="1.7" />
      <rect x="10.75" y="1.75" width="5.5" height="5.5" rx="1.7" />
      <rect x="1.75" y="10.75" width="5.5" height="5.5" rx="1.7" />
      <rect x="10.75" y="10.75" width="5.5" height="5.5" rx="1.7" />
    </svg>
  );
}

/* Two overlapping rounded squares — a soft "stacked layers" mark for
   tranches, in place of the old sharp-pointed diamond. */
export function IconVaults({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="2.5" width="9.5" height="9.5" rx="2.4" />
      <rect x="2.5" y="6" width="9.5" height="9.5" rx="2.4" />
    </svg>
  );
}

export function IconPortfolio({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 15V9" />
      <path d="M9 15V3" />
      <path d="M15 15V11" />
    </svg>
  );
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.75" y="4.25" width="14.5" height="9.5" rx="2.4" />
      <path d="M1.75 7.5H16.25" />
      <circle cx="13" cy="10.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11 15 15" />
    </svg>
  );
}

export function IconGrid({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={3 + c * 5} cy={3 + r * 5} r="1.1" />))}
    </svg>
  );
}

export function IconCollapse({ className, collapsed }: IconProps & { collapsed?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="2.3" />
      <path d="M5.5 2.75V13.25" />
      <path d={collapsed ? "M9.5 6 11.5 8 9.5 10" : "M11 6 9 8 11 10"} />
    </svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25V11.25" />
      <circle cx="8" cy="4.9" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export function IconExternal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6.5 3H4.5A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-2" />
      <path d="M9.5 3H13v3.5" />
      <path d="M13 3 7.5 8.5" />
    </svg>
  );
}

export function IconSort({ className, direction }: IconProps & { direction?: "asc" | "desc" }) {
  return (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={direction === "asc" ? "M2 6 5 3 8 6" : "M2 4 5 7 8 4"} />
    </svg>
  );
}
