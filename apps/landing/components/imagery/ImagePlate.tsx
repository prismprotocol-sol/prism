import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  dots?: boolean;
  grain?: boolean;
};

const CORNERS = [
  "top-[10px] left-[10px]",
  "top-[10px] right-[10px]",
  "bottom-[10px] left-[10px]",
  "bottom-[10px] right-[10px]",
];

/**
 * A photographic plate: dark frame, thin border, small corner dots.
 * The supplied imagery already carries the halftone/degraded treatment,
 * this component only adds the physical "mounted plate" presentation.
 */
export default function ImagePlate({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 809px) 100vw, 50vw",
  dots = true,
  grain = true,
}: Props) {
  return (
    <div className={`relative overflow-hidden border border-line-soft bg-black ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
      {grain && <span className="grain" />}
      {dots &&
        CORNERS.map((position) => (
          <span
            key={position}
            className={`absolute z-[var(--z-chrome)] h-1.5 w-1.5 rounded-full bg-white/40 ${position}`}
          />
        ))}
    </div>
  );
}
