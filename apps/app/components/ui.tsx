import type { ComponentProps } from "react";
import { Card as BaseCard, Button as BaseButton } from "@prism/ui";

/**
 * This app's own softer skin over a couple of @prism/ui primitives, applied
 * via their existing `className` prop rather than editing the shared
 * component source — admin/borrow also depend on Card/Button and keep their
 * current sharp-cornered look untouched.
 */
function cx(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Card(props: ComponentProps<typeof BaseCard>) {
  return <BaseCard {...props} className={cx("rounded-xl", props.className)} />;
}

export function Button(props: ComponentProps<typeof BaseButton>) {
  return <BaseButton {...props} className={cx("rounded-lg", props.className)} />;
}
