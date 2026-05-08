type Props = {
  message: string;
  subtext?: string;
};

export default function AdminEmptyState({ message, subtext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="mb-4 text-zinc-200"
        width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M22 12h-6l-2 3H10l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{message}</p>
      {subtext && (
        <p className="mt-2 max-w-xs text-xs text-zinc-400">{subtext}</p>
      )}
    </div>
  );
}
