import { formatDate } from "@/utils/formatDate";
import { STATUS_OPTIONS } from "@/constants/status-options";
import { PRIORITY_OPTIONS } from "@/constants/priority-options";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useAppStore } from "@/store";
import { useUsersByIds } from "@/hooks/useUsersByIds";
import type { Badge } from "@/store/slices/projectBadge";
import type { ProjectListVM } from "@/type/view-models/projectsList";
import ProgressBar from "@/components/pages/projectsPage/card/ProgressBar";
import ProjectCardMenu from "@/components/pages/projectsPage/card/ProjectCardMenu";
import ActiveMenuBadge from "@/components/pages/projectsPage/card/ActiveMenuBadge";
import AssigneeAvatars from "@/components/users/avatar/AssigneeAvatars";
import DeleteProjectDialog from "./DeleteProjectDialog";
import {
  EllipsisVertical,
  Calendar,
  Paperclip,
  MessageSquareMore,
} from "lucide-react";

type ProjectCardType = {
  project: ProjectListVM;
};

const ProjectCard = ({ project }: ProjectCardType) => {
  const {
    id,
    title,
    priority,
    projectStatus,
    dueDate,
    stats,
    createdAt,
    teamUserIds,
    progress,
    badge,
  } = project;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const teamUsers = useUsersByIds(teamUserIds);

  const toggleActiveBadge = useAppStore((state) => state.toggleActiveBadge);

  const onAction = (value: Badge) => {
    toggleActiveBadge(id, value);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const onMenuClick = (e: React.MouseEvent) => {
    toggleMenu();
    e.stopPropagation();
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative flex items-center justify-between border-b pb-2"
      >
        <h3 className="font-medium truncate">{title}</h3>

        <div className="flex items-center gap-2">
          <button className="order-1" onClick={onMenuClick}>
            <EllipsisVertical strokeWidth={1} fill="black" />
          </button>

          {badge && <ActiveMenuBadge badge={badge} />}
        </div>

        {menuOpen && (
          <ProjectCardMenu
            onClose={() => setMenuOpen(false)}
            onAction={onAction}
            badge={badge}
            onDialog={() => setIsErrorDialogOpen(true)}
          />
        )}
      </div>

      {isErrorDialogOpen && (
        <DeleteProjectDialog
          projectTitle={title}
          onClose={() => setIsErrorDialogOpen(false)}
          isOpen={isErrorDialogOpen}
          projectId={id}
        />
      )}

      <div className="my-4">
        <div className="mb-4">
          <ProgressBar progress={progress} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Team</p>
            <AssigneeAvatars users={teamUsers} />
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Deadline</p>
            <p className="flex items-center text-sm gap-1">
              <Calendar size={16} />
              {formatDate(dueDate)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <p
            style={{ backgroundColor: STATUS_OPTIONS[projectStatus].color }}
            className="p-1 px-1.5 rounded-xl text-xs"
          >
            {STATUS_OPTIONS[projectStatus].label}
          </p>
          <p
            style={{ backgroundColor: PRIORITY_OPTIONS[priority].color }}
            className="p-1 px-1.5 rounded-xl text-xs"
          >
            {PRIORITY_OPTIONS[priority].label}
          </p>
        </div>
      </div>

      <div className="border-t pt-2 flex items-center justify-end gap-4">
        {stats.attachmentCount > 0 && (
          <span className="flex items-center gap-0.5 text-muted-foreground text-sm">
            <Paperclip size={15} />
            {stats.attachmentCount}
          </span>
        )}
        {stats.commentCount > 0 && (
          <span className="flex items-center gap-0.5 text-muted-foreground text-sm">
            <MessageSquareMore size={15} />
            {stats.commentCount}
          </span>
        )}
      </div>
    </>
  );
};
export default ProjectCard;
