import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import { getProgressResult } from "@/utils/getProgressResult";
getProgressResult;
import { STATUS_OPTIONS } from "@/constants/status-options";
import { Link } from "react-router";
import { ArrowLeft, UserRoundPlus, History } from "lucide-react";
import ActiveMenuBadge from "@/components/projects/card/ActiveMenuBadge";
import AssigneeAvatars from "@/components/projects/avatar/AssigneeAvatars";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useUsersByIds } from "@/hooks/useUsersByIds";

type ProjectDetailsHeaderProps = {
  project: ProjectsWithMeta;
};
const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  const { title, projectStatus, teamUserIds, tasks, updatedAt, badge } = project;

  const progress = getProgressResult(tasks, tasks);

  const teamUsers = useUsersByIds(teamUserIds);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/projects"
          className="size-8 shrink-0 flex items-center justify-center border rounded-full"
        >
          <ArrowLeft />
        </Link>

        <h3 className="min-w-0 text-lg font-medium truncate">{title}</h3>

        {badge && <ActiveMenuBadge badge={badge} />}

        <span
          style={{ backgroundColor: STATUS_OPTIONS[projectStatus].color }}
          className="hidden sm:inline-block px-2 rounded-full text-sm"
        >
          {STATUS_OPTIONS[projectStatus].label}
        </span>

        <div className="hidden xl:flex items-center gap-2 ml-4">
          <div className="bg-gray-200 h-2 rounded-md w-40">
            <div
              style={{ width: `${progress.percent}%` }}
              className="bg-accent h-2 rounded-md"
            />
          </div>
          <span className="text-muted-foreground text-sm">
            {progress.percent}%
          </span>
        </div>

        {updatedAt && (
          <span className="hidden 2xl:flex items-center gap-2 text-muted-foreground text-xs border rounded-full p-1">
            {" "}
            <History className="size-3" /> Letztes Update:{" "}
            {formatDate(updatedAt)}{" "}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Mitarbeiter</p>
          <AssigneeAvatars users={teamUsers} />
        </div>

        <Button className="bg-accent hover:bg-accent/95" size="sm">
          <UserRoundPlus />
          <span className="hidden sm:inline">Einladen</span>
        </Button>
      </div>
    </div>
  );
};
export default ProjectDetailsHeader;
