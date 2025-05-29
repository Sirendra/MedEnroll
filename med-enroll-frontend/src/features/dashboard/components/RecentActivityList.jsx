const RecentActivityList = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const imageUrl = `https://robohash.org/${encodeURIComponent(
          activity.fullName
        )}?size=50x50`;

        return (
          <div
            key={index}
            className="flex items-center bg-white shadow rounded-lg px-4 py-3 border border-gray-200"
          >
            <img
              src={imageUrl}
              alt={activity.fullName}
              className="w-12 h-12 rounded-full border-2 border-[var(--color-brand)] mr-4"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {activity.fullName}
              </p>
              <p className="text-sm text-gray-600">
                was added as a customer on{" "}
                <span className="font-medium">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
                {new Date(activity.createdAt).toISOString() !==
                  new Date(activity.updatedAt).toISOString() && (
                  <span className="font-medium">
                    {" "}
                    and last updated on{" "}
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivityList;
