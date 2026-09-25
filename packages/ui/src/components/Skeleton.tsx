export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse border border-line-soft bg-surface-3 ${className ?? ""}`} aria-hidden="true" />;
}
