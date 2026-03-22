import { Pie, PieChart, Sector, ResponsiveContainer, Tooltip } from "recharts";

// #region Sample data
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
];

const PriorityPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default PriorityPieChart;
