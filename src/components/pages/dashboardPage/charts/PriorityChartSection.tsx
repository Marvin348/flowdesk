import PriorityPieChart from "@/components/pages/dashboardPage/charts/PriorityPieChart";

const PriorityChartSection = () => {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium text-xl">Aufgabenpriorität</h3>
      <p className="text-muted-foreground">Aufgeteilt nach Prioritätsstufen</p>
      
      <div className="w-[250px]">
        <PriorityPieChart />
      </div>
    </div>
  );
};
export default PriorityChartSection;
