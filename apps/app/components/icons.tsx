type IconProps = { className?: string };

export function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <rect x="1.5" y="1.5" width="6" height="6" />
      <rect x="10.5" y="1.5" width="6" height="6" />
      <rect x="1.5" y="10.5" width="6" height="6" />
      <rect x="10.5" y="10.5" width="6" height="6" />
    </svg>
  );
}

export function IconVaults({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className={className}>
      <path d="M9 1.5 16.5 6 9 10.5 1.5 6Z" />
      <path d="M1.5 10 9 14.5 16.5 10" strokeLinecap="round" />
    </svg>
  );
}

export function IconPortfolio({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={className}>
      <path d="M3 15V9" />
      <path d="M9 15V3" />
      <path d="M15 15V11" />
    </svg>
  );
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <rect x="1.5" y="4" width="15" height="10" />
      <path d="M1.5 7.5H16.5" />
      <circle cx="13" cy="10.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11 15 15" strokeLinecap="round" />
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
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.5" y="2.5" width="13" height="11" />
      <path d="M5.5 2.5V13.5" />
      <path d={collapsed ? "M9.5 6 11.5 8 9.5 10" : "M11 6 9 8 11 10"} />
    </svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25V11.25" strokeLinecap="round" />
      <circle cx="8" cy="4.9" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export function IconSort({ className, direction }: IconProps & { direction?: "asc" | "desc" }) {
  return (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className={className}>
      <path d={direction === "asc" ? "M2 6 5 3 8 6" : "M2 4 5 7 8 4"} />
    </svg>
  );
}
