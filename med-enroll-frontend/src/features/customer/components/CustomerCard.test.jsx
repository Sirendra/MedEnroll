import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomerCard from "./CustomerCard";

describe("CustomerCard", () => {
  it("renders and handles edit button click", () => {
    const mockEditClick = vi.fn();
    render(
      <CustomerCard
        id="123"
        firstName="John"
        lastName="Doe"
        onEditClick={mockEditClick}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    const img = screen.getByAltText("John Doe");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(encodeURIComponent("John Doe"));

    const button = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(button);
    expect(mockEditClick).toHaveBeenCalledWith("123");
  });
});
