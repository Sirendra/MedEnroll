import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination component", () => {
  const setup = (props = {}) => {
    const onPageChange = vi.fn();
    const defaultProps = {
      totalItems: 25,
      itemsPerPage: 5,
      currentPage: 1,
      onPageChange,
      ...props,
    };
    render(<Pagination {...defaultProps} />);
    return { onPageChange };
  };

  it("renders correct number of page buttons", () => {
    setup(); // 25 items / 5 per page = 5 pages
    const pageButtons = screen.getAllByRole("button", { name: /^[1-5]$/ });
    expect(pageButtons).toHaveLength(5);
  });

  it("disables Prev button on first page", () => {
    setup({ currentPage: 1 });
    expect(screen.getByText("Prev")).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    setup({ currentPage: 5 });
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange with next page when Next is clicked", () => {
    const { onPageChange } = setup({ currentPage: 2 });
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page when Prev is clicked", () => {
    const { onPageChange } = setup({ currentPage: 3 });
    fireEvent.click(screen.getByText("Prev"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when page number is clicked", () => {
    const { onPageChange } = setup({ currentPage: 2 });
    fireEvent.click(screen.getByText("4"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
