import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SizeSelector from "@/components/SizeSelector";

describe("SizeSelector", () => {
  const sizes = ["XS", "S", "M", "L", "XL"];

  it("renders all size options", () => {
    render(<SizeSelector sizes={sizes} selected="M" onChange={() => {}} />);
    for (const size of sizes) {
      expect(screen.getByText(size)).toBeInTheDocument();
    }
  });

  it("calls onChange when a size is clicked", () => {
    const onChange = vi.fn();
    render(<SizeSelector sizes={sizes} selected="M" onChange={onChange} />);
    fireEvent.click(screen.getByText("L"));
    expect(onChange).toHaveBeenCalledWith("L");
  });

  it("highlights the selected size", () => {
    render(<SizeSelector sizes={sizes} selected="M" onChange={() => {}} />);
    const selected = screen.getByText("M");
    expect(selected.className).toContain("border-black");
    expect(selected.className).toContain("bg-black");
  });
});
