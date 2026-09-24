import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        {label}
        {required && <span className="text-muted-2"> *</span>}
      </label>
      {children}
      {hint && <p className="font-sans text-xs text-muted-2">{hint}</p>}
    </div>
  );
}

const inputClasses =
  "w-full border border-line-soft bg-black px-3 py-2.5 font-sans text-sm text-fg outline-none placeholder:text-muted-2 focus:border-line-strong transition-colors duration-[var(--dur-micro)] ease-out";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClasses} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClasses} min-h-24 resize-y`} />;
}

export function AmountInput({
  value,
  onChange,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClasses}
    />
  );
}
