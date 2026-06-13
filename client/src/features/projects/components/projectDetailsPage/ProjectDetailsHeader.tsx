import { STATUS_OPTIONS } from "@/shared/constants/status-options";
import { Link } from "react-router";
import { ArrowLeft, UserRoundPlus, History } from "lucide-react";
import AssigneeAvatars from "@/shared/components/ui/avatar/AvatarGroup";
import { Button } from "@/shared/components/ui/button";
import { formatDate } from "@/shared/utils/formatDate";
import type { ProjectDetailsShellDto } from "@shared/types/dto/projects/projectDetailsShell.dto";

type ProjectDetailsHeaderProps = {
  project: ProjectDetailsShellDto;
  onOpen: () => void;
};
const ProjectDetailsHeader = ({
  project,
  onOpen,
}: ProjectDetailsHeaderProps) => {
  const { title, projectStatus, invitedUsers, updatedAt, progressPercent } =
    project;

  const statusOption = STATUS_OPTIONS[project.projectStatus];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/projects"
          className="size-8 shrink-0 flex items-center justify-center border rounded-full hover:bg-muted duration-200"
        >
          <ArrowLeft />
        </Link>

        <h3 className="min-w-0 text-lg font-medium truncate">{title}</h3>

        {statusOption ? (
          <span
            style={{ backgroundColor: STATUS_OPTIONS[projectStatus].color }}
            className="hidden sm:inline-block px-2 rounded-full text-sm"
          >
            {STATUS_OPTIONS[projectStatus].label}
          </span>
        ) : (
          <span>Missing status</span>
        )}

        <div className="hidden xl:flex items-center gap-2 ml-4">
          <div className="bg-muted h-2 rounded-md w-40">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-accent h-2 rounded-md"
            />
          </div>
          <span className="text-muted-foreground text-sm">
            {progressPercent}%
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
          <p className="text-muted-foreground text-sm">Team</p>
          <AssigneeAvatars users={invitedUsers} />
        </div>

        <Button
          className="bg-accent hover:bg-accent/95"
          size="sm"
          onClick={onOpen}
        >
          <UserRoundPlus />
          <span className="hidden sm:inline">Einladen</span>
        </Button>
      </div>
    </div>
  );
};
export default ProjectDetailsHeader;
