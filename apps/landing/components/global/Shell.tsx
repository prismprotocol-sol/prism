/** Persistent architectural grid shell: centered frame with vertical guide rules. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[2600px]">
      <div className="mx-[clamp(10px,1.6vw,40px)] border-x border-line-soft max-mobile:mx-2">
        {children}
      </div>
    </div>
  );
}
