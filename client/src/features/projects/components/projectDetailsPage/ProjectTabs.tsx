import { Button } from "@/shared/components/ui/button";
import { TAB_VIEW_OPTIONS } from "@/features/projects/constants/tab-view.options";
import type { ActiveTab } from "@/pages/ProjectDetailsPage";

type ProjectTabsProps = {
  activeTab: ActiveTab;
  onChange: (value: ActiveTab) => void;
};

const ProjectTabs = ({ activeTab, onChange }: ProjectTabsProps) => {
  return (
    <div className="border-y py-2">
      <div>
        {TAB_VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant="filter"
            data-state={activeTab === value ? "active" : "inactive"}
            onClick={() => onChange(value)}
          >
            <Icon className={activeTab === value ? "text-accent" : "none"} />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ProjectTabs;
