import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function PollResults({ options }: { options: { text: string; votes: number }[] }) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
  
  return (
    <PieChart width={400} height={300}>
      <Pie data={options} dataKey="votes" nameKey="text" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
        {options.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
