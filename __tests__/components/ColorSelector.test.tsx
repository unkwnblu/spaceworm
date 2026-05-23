import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ColorSelector from "@/components/ColorSelector";

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Olive", hex: "#556b2f" },
];

describe("ColorSelector", () => {
  it("renders all color options", () => {
    render(<ColorSelector colors={colors} selected="Black" onChange={() => {}} />);
    for (const color of colors) {
      expect(screen.getByLabelText(color.name)).toBeInTheDocument();
    }
  });

  it("calls onChange when a color is clicked", () => {
    const onChange = vi.fn();
    render(<ColorSelector colors={colors} selected="Black" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("White"));
    expect(onChange).toHaveBeenCalledWith("White");
  });

  it("marks the selected color with aria-pressed", () => {
    render(<ColorSelector colors={colors} selected="Olive" onChange={() => {}} />);
    expect(screen.getByLabelText("Olive")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Black")).toHaveAttribute("aria-pressed", "false");
  });

  it("applies background color from hex", () => {
    render(<ColorSelector colors={colors} selected="Black" onChange={() => {}} />);
    const btn = screen.getByLabelText("Olive");
    expect(btn.style.backgroundColor).toBe("rgb(85, 107, 47)");
  });
});
