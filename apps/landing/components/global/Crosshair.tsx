type Props = {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
};

/** A small technical "+" marker, absolutely positioned within a relative parent. */
export default function Crosshair({ top, left, right, bottom }: Props) {
  return (
    <span
      className="crosshair"
      style={{ top, left, right, bottom }}
      aria-hidden="true"
    />
  );
}
