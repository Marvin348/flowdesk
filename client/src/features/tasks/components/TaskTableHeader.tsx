import { LIST_TABLE_OPTIONS } from "@/shared/constants/table-header";

const TaskTableHeader = () => {
  return (
    <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] p-3 bg-muted rounded-t-md">
      {LIST_TABLE_OPTIONS.map((opt) => (
        <span key={opt.value} className="w-fit flex items-center gap-1">
          {opt.label}
        </span>
      ))}
    </div>
  );
};
export default TaskTableHeader;
