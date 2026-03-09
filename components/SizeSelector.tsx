"use client";

type Props = {
  sizes: string[];
  selected: string;
  onChange: (size: string) => void;
};

export default function SizeSelector({ sizes, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`flex h-10 min-w-[2.75rem] items-center justify-center border px-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            selected === size
              ? "border-black bg-black text-white"
              : "border-zinc-300 bg-white text-black hover:border-black"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
