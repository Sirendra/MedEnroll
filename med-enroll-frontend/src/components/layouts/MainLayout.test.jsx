import { describe, it, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import MainLayout from "./MainLayout";

vi.mock("./Navbar", () => ({
  default: () => <nav>Mock Navbar</nav>,
}));

describe("MainLayout", () => {
  it("renders Navbar", () => {
    render(
      <MainLayout>
        <p>Test Content</p>
      </MainLayout>
    );
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
  });

  it("renders children content inside main", () => {
    render(
      <MainLayout>
        <p>Test Content</p>
      </MainLayout>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
