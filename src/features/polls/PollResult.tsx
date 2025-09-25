import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import type { Poll, Option } from "../../interfaces/types";

const POLL_REFRESH_INTERVAL = 3000; // 3 seconds

const PollResult = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPoll = async () => {
    if (!id) return;
    try {
      const response = await api.get(ENDPOINTS.POLLS.DETAIL(Number(id)));
      setPoll(response.data);
    } catch (err) {
      console.error("Failed to fetch poll:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll(); // initial fetch

    // Setup interval for real-time updates
    const intervalId = setInterval(fetchPoll, POLL_REFRESH_INTERVAL);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, [id]);

  if (loading) return <div className="p-4">Loading results...</div>;
  if (!poll) return <div className="p-4">Poll not found.</div>;

  const totalVotes = poll.options?.reduce((sum, o) => sum + o.vote_count, 0) || 0;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{poll.title} - Results</h1>
      {poll.description && <p className="mb-4">{poll.description}</p>}

      <div className="mb-4">
        {poll.options?.map((opt: Option) => (
          <div key={opt.id} className="flex justify-between mb-1">
            <span>{opt.text}</span>
            <span>{opt.vote_count} votes</span>
          </div>
        ))}
      </div>

      <div className="w-full h-64">
        <PieChart options={poll.options || []} />
      </div>
    </div>
  );
};

interface PieChartProps {
  options: Option[];
}

const PieChart = ({ options }: PieChartProps) => {
  const total = options.reduce((sum, o) => sum + o.vote_count, 0) || 1;
  const colors = ["#3b82f6", "#ef4444", "#facc15", "#10b981", "#8b5cf6"];
  let startAngle = 0;

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {options.map((o, idx) => {
        const angle = (o.vote_count / total) * 360;
        const endAngle = startAngle + angle;
        const x1 = 100 + 100 * Math.cos((Math.PI / 180) * startAngle);
        const y1 = 100 + 100 * Math.sin((Math.PI / 180) * startAngle);
        const x2 = 100 + 100 * Math.cos((Math.PI / 180) * endAngle);
        const y2 = 100 + 100 * Math.sin((Math.PI / 180) * endAngle);
        const largeArcFlag = angle > 180 ? 1 : 0;

        const path = `M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`;
        startAngle += angle;

        return <path key={idx} d={path} fill={colors[idx % colors.length]} />;
      })}
    </svg>
  );
};

export default PollResult;
