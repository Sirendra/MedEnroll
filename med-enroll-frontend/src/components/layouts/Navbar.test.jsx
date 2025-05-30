import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

let isAuthenticatedMock = true;
const logoutMock = vi.fn();

vi.mock("../../contexts/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: isAuthenticatedMock,
    logout: logoutMock,
  }),
}));

vi.mock("../../assets/brand.svg", () => ({
  default: "/mocked-brand.svg",
}));

describe("Navbar component", () => {
  beforeEach(() => {
    logoutMock.mockClear();
  });

  it("renders brand and navigation links when authenticated", () => {
    isAuthenticatedMock = true;

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("MedEnroll")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
  });

  it("renders login and register links when not authenticated", () => {
    isAuthenticatedMock = false;

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("toggles dropdown on avatar click and calls logout on Logout click", () => {
    isAuthenticatedMock = true;

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const avatar = screen.getByAltText("Profile");
    fireEvent.click(avatar);

    // Dropdown should appear
    const logoutBtn = screen.getByText("Logout");
    expect(logoutBtn).toBeInTheDocument();

    // Click logout
    fireEvent.click(logoutBtn);

    expect(logoutMock).toHaveBeenCalledTimes(1);
    // Dropdown closes after logout click
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
