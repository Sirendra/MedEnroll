const CustomerCard = ({ id, firstName, lastName, onEditClick }) => {
  const fullName = `${firstName} ${lastName}`;
  const imageUrl = `https://robohash.org/${encodeURIComponent(
    fullName
  )}?size=150x150`;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center">
      <img
        src={imageUrl}
        alt={fullName}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h2 className="text-lg font-semibold">
        {firstName} {lastName}
      </h2>
      <button
        onClick={() => onEditClick(id)}
        className="w-50 bg-color-brand hover:bg-color-hover text-white font-semibold py-2 px-4 rounded transition"
      >
        Edit
      </button>
    </div>
  );
};

export default CustomerCard;
