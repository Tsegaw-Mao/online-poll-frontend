import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Poll } from "../../interfaces/types";
import { ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios"; // import your axios instance

const PollList = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await api.get<Poll[]>(ENDPOINTS.POLLS.LIST);
        setPolls(res.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
            "Failed to fetch polls. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) return <div className="p-4">Loading polls...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!polls.length) return <div className="p-4">No polls available.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Available Polls</h1>
      {polls.map((poll) => (
        <div
          key={poll.id}
          className="p-4 border rounded shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">{poll.title}</h2>
          {poll.description && (
            <p className="text-gray-700">{poll.description}</p>
          )}
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
        </div>
      ))}
    </div>
  );
};

export default PollList;
