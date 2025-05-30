import { describe, it, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

// Mock the route components
vi.mock("../../features/customer/pages/CustomerPage", () => ({
  default: () => <div>CustomerPage</div>,
}));
vi.mock("../../features/customer/pages/CustomerListPage", () => ({
  default: () => <div>CustomerListPage</div>,
}));
vi.mock("../../features/auth/pages/Login", () => ({
  default: () => <div>LoginPage</div>,
}));
vi.mock("../../features/auth/pages/Register", () => ({
  default: () => <div>RegisterPage</div>,
}));
vi.mock("../../features/dashboard/pages/Dashboard", () => ({
  default: () => <div>DashboardPage</div>,
}));

describe("AppRoutes", () => {
  function renderWithRouter(initialEntries) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    );
  }

  it("renders Login page at /login", () => {
    renderWithRouter(["/login"]);
    expect(screen.getByText("LoginPage")).toBeInTheDocument();
  });

  it("renders Register page at /register", () => {
    renderWithRouter(["/register"]);
    expect(screen.getByText("RegisterPage")).toBeInTheDocument();
  });

  it("renders Dashboard page at /dashboard", () => {
    renderWithRouter(["/dashboard"]);
    expect(screen.getByText("DashboardPage")).toBeInTheDocument();
  });

  it("renders CustomerPage at /register-customer", () => {
    renderWithRouter(["/register-customer"]);
    expect(screen.getByText("CustomerPage")).toBeInTheDocument();
  });

  it("renders CustomerListPage at /customers", () => {
    renderWithRouter(["/customers"]);
    expect(screen.getByText("CustomerListPage")).toBeInTheDocument();
  });

  it("redirects unknown routes to /register-customer", () => {
    renderWithRouter(["/unknown-route"]);
    expect(screen.getByText("CustomerPage")).toBeInTheDocument();
  });
});
