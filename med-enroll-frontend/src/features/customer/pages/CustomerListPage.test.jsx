import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CustomerListPage from "./CustomerListPage";
import * as customerService from "../services/customerService";

vi.mock("../components/CustomerCard", () => ({
  default: ({ id, firstName, lastName, onEditClick }) => (
    <div data-testid="customer-card" onClick={() => onEditClick(id)}>
      {firstName} {lastName}
    </div>
  ),
}));

vi.mock("../components/CustomerForm", () => ({
  default: () => <div>CustomerFormMock</div>,
}));

vi.mock("../../../components/common/Modal", () => ({
  default: ({ children, onClose }) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close Modal</button>
      {children}
    </div>
  ),
}));

vi.mock("../../../components/common/Pagination", () => ({
  default: ({ currentPage, onPageChange }) => (
    <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
  ),
}));

describe("CustomerListPage", () => {
  const customersMock = [
    { _id: "1", firstName: "John", lastName: "Doe" },
    { _id: "2", firstName: "Jane", lastName: "Smith" },
    { _id: "3", firstName: "Alice", lastName: "Johnson" },
  ];

  beforeEach(() => {
    vi.spyOn(customerService, "searchAllCustomers").mockResolvedValue(
      customersMock
    );
  });

  it("fetches and displays customers", async () => {
    render(<CustomerListPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId("customer-card")).toHaveLength(
        customersMock.length
      );
    });
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("filters customers based on search term", async () => {
    render(<CustomerListPage />);
    await waitFor(() => screen.getAllByTestId("customer-card"));

    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: "Jane" } });

    await waitFor(() => {
      const cards = screen.getAllByTestId("customer-card");
      expect(cards).toHaveLength(1);
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("opens modal with CustomerForm on edit click and closes it", async () => {
    render(<CustomerListPage />);
    await waitFor(() => screen.getAllByTestId("customer-card"));

    fireEvent.click(screen.getByText("John Doe"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();

    expect(screen.getByText("CustomerFormMock")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close modal/i));
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });
});
