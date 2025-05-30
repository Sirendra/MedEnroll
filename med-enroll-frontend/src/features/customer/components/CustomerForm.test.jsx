import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerForm from "./CustomerForm";

vi.mock("../services/customerService", () => ({
  addCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  fetchPossibleCustomers: vi.fn(),
  fuzzyMatchCustomers: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  addCustomer,
  updateCustomer,
  fetchPossibleCustomers,
  fuzzyMatchCustomers,
} from "../services/customerService";
import { toast } from "react-toastify";

describe("CustomerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits new customer", async () => {
    addCustomer.mockResolvedValueOnce({});
    fuzzyMatchCustomers.mockReturnValue([]);

    render(<CustomerForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "John");
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Doe");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(addCustomer).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Customer added successfully!"
      );
    });
  });

  it("updates existing customer", async () => {
    updateCustomer.mockResolvedValueOnce({});
    fuzzyMatchCustomers.mockReturnValue([]);

    const customer = { _id: "abc123", firstName: "Jane", lastName: "Smith" };
    render(<CustomerForm customer={customer} />);

    const lastNameInput = screen.getByLabelText(/last name/i);

    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Doe");

    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(updateCustomer).toHaveBeenCalledWith("abc123", {
        firstName: "Jane",
        lastName: "Doe",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Customer updated successfully!"
      );
    });
  });

  it("shows duplicates on typing", async () => {
    const mockResults = [
      { _id: "1", firstName: "John", lastName: "Doe" },
      { _id: "2", firstName: "Johnny", lastName: "Doe" },
    ];
    fetchPossibleCustomers.mockResolvedValue(mockResults);
    fuzzyMatchCustomers.mockImplementation((results) => results);

    render(<CustomerForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    await userEvent.type(firstNameInput, "Jo");
    await userEvent.type(lastNameInput, "Do");

    await waitFor(() => {
      expect(fetchPossibleCustomers).toHaveBeenCalledWith("Jo", "Do");
      expect(fuzzyMatchCustomers).toHaveBeenCalled();
    });

    expect(screen.getByText(/possible duplicates found/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Johnny Doe")).toBeInTheDocument();
  });

  it("shows warning on duplicate error", async () => {
    addCustomer.mockRejectedValueOnce({ response: { status: 409 } });
    fuzzyMatchCustomers.mockReturnValue([]);

    render(<CustomerForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");

    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Customer already exists.");
    });
  });

  it("shows error on generic failure", async () => {
    addCustomer.mockRejectedValueOnce(new Error("Error"));
    fuzzyMatchCustomers.mockReturnValue([]);

    render(<CustomerForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");

    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
    });
  });
});
