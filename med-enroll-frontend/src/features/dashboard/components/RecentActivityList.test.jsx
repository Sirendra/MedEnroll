import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RecentActivityList from "./RecentActivityList";

describe("RecentActivityList", () => {
  const activities = [
    {
      fullName: "Alice Johnson",
      createdAt: "2023-01-01T10:00:00Z",
      updatedAt: "2023-01-01T10:00:00Z",
    },
    {
      fullName: "Bob Smith",
      createdAt: "2023-02-01T12:00:00Z",
      updatedAt: "2023-02-05T15:30:00Z",
    },
  ];

  it("renders activity items with correct data", () => {
    render(<RecentActivityList activities={activities} />);

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();

    const addedTexts = screen.getAllByText(/was added as a customer on/i);
    expect(addedTexts.length).toBe(2);

    expect(screen.getByText("1/1/2023")).toBeInTheDocument();
    expect(screen.getByText("2/1/2023")).toBeInTheDocument();

    expect(screen.getByText(/and last updated on/i)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("2/5/2023"))
    ).toBeInTheDocument();
    activities.forEach(({ fullName }) => {
      const img = screen.getByAltText(fullName);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        expect.stringContaining(encodeURIComponent(fullName))
      );
    });
  });

  it("renders empty container if no activities", () => {
    const { container } = render(<RecentActivityList activities={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
