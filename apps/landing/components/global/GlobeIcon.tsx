export default function GlobeIcon({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`group relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="block"
        aria-hidden="true"
      >
        <circle cx="22" cy="22" r="20" />
        <line x1="2" y1="22" x2="42" y2="22" />
        {/* Meridian lines sweep horizontally to fake a slowly rotating
            wireframe sphere — the outline and equator stay put, only the
            longitude lines move, so it reads as one small ambient detail
            rather than a spinner. */}
        <g className="globe-meridians motion-safe:animate-globe-spin">
          <ellipse cx="22" cy="22" rx="8" ry="20" />
          <path d="M22 2c-7 5-7 33 0 40" />
          <path d="M22 2c7 5 7 33 0 40" />
        </g>
      </svg>
      <span
        className="pointer-events-none absolute left-1/2 top-[-10px] h-0 w-0 -translate-x-1/2 border-x-4 border-b-[5px] border-x-transparent border-b-muted opacity-0 transition-[opacity,transform] duration-[var(--dur-micro)] ease-out group-hover:-translate-y-[3px] group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-[-10px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-[5px] border-x-transparent border-t-muted opacity-0 transition-[opacity,transform] duration-[var(--dur-micro)] ease-out group-hover:translate-y-[3px] group-hover:opacity-100"
        aria-hidden="true"
      />
    </span>
  );
}
