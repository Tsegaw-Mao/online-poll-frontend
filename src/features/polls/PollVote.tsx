import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import type { Poll, Option } from "../../interfaces/types";

const PollVote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`${ENDPOINTS.POLLS.DETAIL(Number(id))}`);
        setPoll(response.data);
      } catch (err) {
        console.error("Failed to fetch poll:", err);
      }
    };
    if (id) fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    setLoading(true);

    try {
      const payload = { poll: poll.id, option: selectedOption };
      await api.post(ENDPOINTS.POLLS.VOTE, payload);
      alert("✅ Vote cast successfully!");
      navigate(`/poll/${poll.id}/result`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to cast vote";
      alert(`❌ Error: ${msg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div className="p-4">Loading poll...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      {poll.description && <p className="mb-4">{poll.description}</p>}

      <div className="space-y-2 mb-4">
        {poll.options?.map((opt: Option) => (
          <div key={opt.id}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pollOption"
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={() => setSelectedOption(opt.id)}
              />
              {opt.text}
            </label>
          </div>
        ))}
      </div>

      <button
        disabled={loading || selectedOption === null}
        onClick={handleVote}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Voting..." : "Vote"}
      </button>
    </div>
  );
};

export default PollVote;
