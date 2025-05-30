import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import * as dashboardService from "../services/dashboardService";
import * as authContext from "../../../contexts/authContext";

vi.mock("../components/RecentActivityList", () => {
  return {
    default: ({ activities }) => (
      <div data-testid="recent-activity-list">
        {activities.map((a, i) => (
          <div key={i}>{a.name || a.id}</div>
        ))}
      </div>
    ),
  };
});

describe("Dashboard", () => {
  const userMock = { fullName: "John Doe" };

  beforeEach(() => {
    vi.spyOn(authContext, "useAuth").mockReturnValue({ user: userMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders greeting with user name", () => {
    render(<Dashboard />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(userMock.fullName)).toBeInTheDocument();
  });

  it("fetches and shows recent activities on mount", async () => {
    const recentActivities = [
      { id: "1", name: "Activity 1" },
      { id: "2", name: "Activity 2" },
    ];
    vi.spyOn(dashboardService, "getRecentActivities").mockResolvedValue({
      data: { data: recentActivities },
    });

    render(<Dashboard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    recentActivities.forEach((activity) => {
      expect(screen.getByText(activity.name)).toBeInTheDocument();
    });
  });

  it("shows no recent activity message if empty", async () => {
    vi.spyOn(dashboardService, "getRecentActivities").mockResolvedValue({
      data: { data: [] },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no recent activity found/i)).toBeInTheDocument();
    });
  });

  it("performs search and shows results", async () => {
    const searchResults = [{ id: "100", name: "Search Result 1" }];
    vi.spyOn(dashboardService, "getRecentActivities").mockResolvedValue({
      data: { data: [] },
    });
    vi.spyOn(dashboardService, "searchByName").mockResolvedValue({
      data: { data: searchResults },
    });

    render(<Dashboard />);

    const input = screen.getByPlaceholderText(/search customers/i);

    fireEvent.change(input, { target: { value: "Search" } });

    expect(screen.getByText(/searching/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
      searchResults.forEach((r) => {
        expect(screen.getByText(r.name)).toBeInTheDocument();
      });
    });

    expect(screen.queryByText(/recent activity/i)).not.toBeInTheDocument();
  });

  it("clears search results and shows recent activity when searchTerm is empty", async () => {
    const recentActivities = [{ id: "1", name: "Activity 1" }];
    vi.spyOn(dashboardService, "getRecentActivities").mockResolvedValue({
      data: { data: recentActivities },
    });

    render(<Dashboard />);

    const input = screen.getByPlaceholderText(/search customers/i);

    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
      recentActivities.forEach((activity) => {
        expect(screen.getByText(activity.name)).toBeInTheDocument();
      });
    });
  });
});
