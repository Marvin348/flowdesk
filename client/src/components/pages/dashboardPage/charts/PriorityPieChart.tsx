import type { TaskPriorityItem } from "@/utils/dashboard/getTaskPriorityItems";
import CustomLegend from "@/components/pages/dashboardPage/charts/CustomLegend";
import {
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const PriorityPieChart = ({ data }: { data: TaskPriorityItem[] }) => {

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          innerRadius="40%"
          outerRadius="80%"
          dataKey="count"
          cx="50%"
          cy="50%"
        >
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color || "#8884d8"} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend data={data} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default PriorityPieChart;
