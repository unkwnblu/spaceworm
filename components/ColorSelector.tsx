"use client";

type Color = { name: string; hex: string };

type Props = {
  colors: Color[];
  selected: string;
  onChange: (colorName: string) => void;
};

export default function ColorSelector({ colors, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onChange(color.name)}
          title={color.name}
          className={`relative h-7 w-7 transition-all ${
            selected === color.name
              ? "ring-2 ring-black ring-offset-2"
              : "ring-1 ring-zinc-300 hover:ring-zinc-500"
          }`}
          style={{ backgroundColor: color.hex }}
          aria-label={color.name}
          aria-pressed={selected === color.name}
        >
          {/* Checkmark for selected */}
          {selected === color.name && (
            <svg
              className="absolute inset-0 m-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color.hex === "#ffffff" || color.hex === "#fafaf9" ? "#000" : "#fff"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
