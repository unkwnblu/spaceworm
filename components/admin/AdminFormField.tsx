import { ReactNode } from "react";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export default function AdminFormField({ label, hint, error, children }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[10px] text-zinc-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}
