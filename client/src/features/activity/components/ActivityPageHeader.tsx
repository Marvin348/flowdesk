import ActivityToolbar from "./ActivityToolbar";

const ActivityPageHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Aktivität</h2>
      <div>
        <ActivityToolbar />
      </div>
    </div>
  );
};
export default ActivityPageHeader;
