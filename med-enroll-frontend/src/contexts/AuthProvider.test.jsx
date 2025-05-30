import { render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { authContext } from "./authContext";
import { AuthProvider as Provider } from "./AuthProvider";

vi.mock("jwt-decode", () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockLocation = { pathname: "/" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("AuthProvider", async () => {
  const jwtDecode = (await import("jwt-decode")).default;

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    jwtDecode.mockReset();
    mockLocation.pathname = "/";
  });

  function TestComponent() {
    const { isAuthenticated, user, login, logout } = useContext(authContext);

    return (
      <div>
        <div>Authenticated: {isAuthenticated ? "yes" : "no"}</div>
        <div>User: {user ? user.fullName : "none"}</div>
        <button onClick={() => login("valid-token")}>Login</button>
        <button onClick={logout}>Logout</button>
        <CurrentPath />
      </div>
    );
  }

  function CurrentPath() {
    const location = useLocation();
    return <div>Path: {location.pathname}</div>;
  }

  it("redirects to /login if no token and not on /login or /register", async () => {
    mockLocation.pathname = "/dashboard";

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Provider>
          <TestComponent />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    expect(screen.getByText("Authenticated: no")).toBeInTheDocument();
  });

  it("does NOT redirect if on /login or /register without token", async () => {
    for (const path of ["/login", "/register"]) {
      mockLocation.pathname = path;
      mockNavigate.mockReset();

      render(
        <MemoryRouter initialEntries={[path]}>
          <Provider>
            <TestComponent />
          </Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    }
  });

  it("sets user and authenticated if token is valid", async () => {
    mockLocation.pathname = "/";
    localStorage.setItem("token", "valid-token");
    jwtDecode.mockReturnValue({ userId: "123", fullName: "John Doe" });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Provider>
          <TestComponent />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Authenticated: no")).toBeInTheDocument();
      expect(screen.getByText("User: none")).toBeInTheDocument();
    });
  });

  it("clears token and redirects to /login if token is invalid", async () => {
    mockLocation.pathname = "/dashboard";
    localStorage.setItem("token", "invalid-token");
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Provider>
          <TestComponent />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByText("Authenticated: no")).toBeInTheDocument();
  });

  it("login function sets token, user, authenticated and navigates to /dashboard", async () => {
    jwtDecode.mockReturnValue({ userId: "1", fullName: "Jane Doe" });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Provider>
          <TestComponent />
        </Provider>
      </MemoryRouter>
    );

    const loginBtn = screen.getByRole("button", { name: /login/i });
    loginBtn.click();

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("valid-token");
      expect(screen.getByText("Authenticated: yes")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("logout function clears token, user, authenticated and navigates to /login", async () => {
    localStorage.setItem("token", "valid-token");
    jwtDecode.mockReturnValue({ userId: "1", fullName: "Jane Doe" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Provider>
          <TestComponent />
        </Provider>
      </MemoryRouter>
    );

    screen.getByText("Logout").click();

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
      expect(screen.getByText("Authenticated: no")).toBeInTheDocument();
      expect(screen.getByText("User: none")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
