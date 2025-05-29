import { useEffect, useState } from "react";
import RecentActivityList from "../components/RecentActivityList";
import {
  getRecentActivities,
  searchByName,
} from "../services/dashboardService";
import { useAuth } from "../../../contexts/authContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Load recent activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getRecentActivities(3);
        setRecentActivities(response.data.data);
      } catch (error) {
        console.error("Failed to fetch recent activities", error);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchActivities();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchByName(searchTerm);
        setSearchResults(results.data.data);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        Welcome back,{" "}
        <span className="text-[var(--color-brand)]">{user?.fullName}</span>!
      </h1>

      <div>
        <input
          type="search"
          placeholder="Search customers by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        />
      </div>

      {loadingSearch && <p className="text-sm text-gray-500">Searching...</p>}

      {searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Search Results
          </h2>
          <RecentActivityList activities={searchResults} />
        </div>
      )}

      {/* Show recent activity only if no search term */}
      {!searchTerm && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Recent Activity
          </h2>
          {loadingRecent ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : recentActivities.length > 0 ? (
            <RecentActivityList activities={recentActivities} />
          ) : (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
