import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

describe("Register component basic render", () => {
  it("renders the register heading and submit button", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });
});
