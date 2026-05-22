export type Status = "upcoming" | "live" | "sold-out" | "past" | "pending" | "fulfilled" | "cancelled";

const CONFIG: Record<Status, { label: string; className: string; pulse?: boolean }> = {
  upcoming:   { label: "Upcoming",  className: "bg-zinc-100 text-zinc-600" },
  live:       { label: "Live",      className: "bg-black text-white", pulse: true },
  "sold-out": { label: "Sold Out",  className: "bg-zinc-200 text-zinc-400" },
  past:       { label: "Past",      className: "bg-zinc-100 text-zinc-400" },
  pending:    { label: "Pending",   className: "bg-zinc-100 text-zinc-600" },
  fulfilled:  { label: "Fulfilled", className: "bg-zinc-900 text-white" },
  cancelled:  { label: "Cancelled", className: "bg-zinc-100 text-zinc-400" },
};

export default function AdminStatusBadge({ status }: { status: Status }) {
  const { label, className, pulse } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${className}`}>
      <span className={`h-1 w-1 rounded-full bg-current ${pulse ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}
