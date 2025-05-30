import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CustomerPage from "./CustomerPage";

vi.mock("../components/CustomerForm", () => ({
  default: () => <div data-testid="customer-form">CustomerFormMock</div>,
}));

describe("CustomerPage", () => {
  it("renders heading and CustomerForm", () => {
    render(<CustomerPage />);

    expect(screen.getByText(/customer registration/i)).toBeInTheDocument();
    expect(screen.getByTestId("customer-form")).toBeInTheDocument();
  });
});
