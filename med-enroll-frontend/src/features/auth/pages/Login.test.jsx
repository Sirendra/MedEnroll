import { describe, it, expect, vi, beforeEach } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../../../contexts/authContext";
import { toast } from "react-toastify";

vi.mock("../services/authService");
vi.mock("../../../contexts/authContext");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Login component", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  it("renders login form", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits form and logs in successfully", async () => {
    const token = "fake-token";
    loginAdmin.mockResolvedValue({
      data: {
        data: {
          token,
        },
      },
    });

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginAdmin).toHaveBeenCalledWith({
        userName: "testuser",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith("Successfully logged in!");
      expect(mockLogin).toHaveBeenCalledWith(token);
    });
  });

  it("shows error toast on invalid credentials (400)", async () => {
    loginAdmin.mockRejectedValue({
      response: { status: 400 },
    });

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/username/i), "wronguser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials.");
    });
  });

  it("shows generic error toast on other errors", async () => {
    loginAdmin.mockRejectedValue(new Error("Network Error"));

    render(<Login />);
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
    });
  });
});
