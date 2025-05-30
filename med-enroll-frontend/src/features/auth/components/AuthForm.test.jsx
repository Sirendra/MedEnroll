import { describe, it, expect, vi, beforeEach } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";

describe("AuthForm", () => {
  const mockRegister = vi.fn().mockImplementation((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  const mockHandleSubmit = (fn) => (e) => {
    e.preventDefault();
    fn();
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields and submit button", () => {
    render(
      <AuthForm
        register={mockRegister}
        errors={{}}
        onSubmit={mockOnSubmit}
        handleSubmit={mockHandleSubmit}
        submitLabel="Sign In"
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();

    // register called for userName and password
    expect(mockRegister).toHaveBeenCalledWith("userName");
    expect(mockRegister).toHaveBeenCalledWith("password");
  });

  it("shows error messages when errors prop has messages", () => {
    const errors = {
      userName: { message: "Username is required" },
      password: { message: "Password is required" },
    };

    render(
      <AuthForm
        register={mockRegister}
        errors={errors}
        onSubmit={mockOnSubmit}
        handleSubmit={mockHandleSubmit}
        submitLabel="Sign In"
      />
    );

    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(
      <AuthForm
        register={mockRegister}
        errors={{}}
        onSubmit={mockOnSubmit}
        handleSubmit={mockHandleSubmit}
        submitLabel="Sign In"
      />
    );

    const form = screen.getByTestId("auth-form");
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("renders children inside the form", () => {
    render(
      <AuthForm
        register={mockRegister}
        errors={{}}
        onSubmit={mockOnSubmit}
        handleSubmit={mockHandleSubmit}
        submitLabel="Sign In"
      >
        <div data-testid="child">Extra content</div>
      </AuthForm>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
