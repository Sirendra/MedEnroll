import { describe, it, expect, vi } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal component", () => {
  it("renders children inside the modal", () => {
    render(
      <Modal onClose={() => {}}>
        <p>Test content</p>
      </Modal>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();

    render(
      <Modal onClose={onCloseMock}>
        <p>Another test</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
