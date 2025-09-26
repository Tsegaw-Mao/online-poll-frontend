import { useState, useEffect } from "react";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import type { Poll } from "../../interfaces/types";
import { Link } from "react-router-dom";

const PollList = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [filters, setFilters] = useState({
    created_by: "",
    id: "",
    expiry_start: "",
    expiry_end: "",
    created_start: "",
    created_end: "",
  });

  // pagination & sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState("-created_at"); // newest first

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINTS.POLLS.LIST, {
        params: {
          created_by: filters.created_by || undefined,
          id: filters.id || undefined,
          expiry_start: filters.expiry_start || undefined,
          expiry_end: filters.expiry_end || undefined,
          created_start: filters.created_start || undefined,
          created_end: filters.created_end || undefined,
          page,
          ordering,
        },
      });

      setPolls(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 10)); // 10 per page
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Failed to fetch polls. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ordering]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setPage(1); // reset to first page when filtering
    fetchPolls();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Polls</h1>

      {/* Filter Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="created_by"
          placeholder="Created by"
          value={filters.created_by}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="id"
          placeholder="Poll ID"
          value={filters.id}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="expiry_start"
          value={filters.expiry_start}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="expiry_end"
          value={filters.expiry_end}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="created_start"
          value={filters.created_start}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="created_end"
          value={filters.created_end}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>

        {/* Sorting dropdown */}
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="expiry_date">Expiry (Earliest)</option>
          <option value="-expiry_date">Expiry (Latest)</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
        </select>
      </div>

      {/* Polls List */}
      {loading && <p>Loading polls...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && polls.length === 0 && <p>No polls found.</p>}

      <ul className="space-y-4">
        {polls.map((poll) => (
          <li
            key={poll.id}
            className="border p-4 rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{poll.title}</h2>
            <p className="text-sm text-gray-600">
              Created by: {poll.created_by}
            </p>
            <p className="text-sm text-gray-500">
              Expiry: {new Date(poll.expiry_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(poll.created_at).toLocaleDateString()}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/poll/${poll.id}/vote`}
                className="text-blue-600 hover:underline"
              >
                Vote
              </Link>
              <Link
                to={`/poll/${poll.id}/result`}
                className="text-green-600 hover:underline"
              >
                Results
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PollList;
