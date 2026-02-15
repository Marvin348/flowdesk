import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import {
  EllipsisVertical,
  Calendar,
  Paperclip,
  MessageSquareMore,
} from "lucide-react";
import AssigneeAvatars from "@/components/projects/avatar/AssigneeAvatars";
import { formatDate } from "@/utils/formatDate";
import { STATUS_OPTIONS } from "@/constants/status-options";
import { PRIORITY_OPTIONS } from "@/constants/priority-options";
import ProgressBar from "@/components/projects/card/ProgressBar";
import { getProgressResult } from "@/utils/getProgressResult";
import ProjectCardMenu from "@/components/projects/card/ProjectCardMenu";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import ActiveMenuBadge from "@/components/projects/card/ActiveMenuBadge";
import { useAppStore } from "@/store";
import type { Badge } from "@/store/slices/ui-state/projectBadge";

type ProjectCardType = {
  project: ProjectsWithMeta;
};

const ProjectCard = ({ project }: ProjectCardType) => {
  const {
    id,
    title,
    priority,
    status,
    dueDate,
    createdAt,
    comments,
    commentIds,
    users,
    tasks,
    taskIds,
    attachments,
    attachmenetIds,
    badge,
  } = project;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const progress = getProgressResult(taskIds, tasks);

  const toggleActiveBadge = useAppStore((state) => state.toggleActiveBadge);

  const onAction = (value: Badge) => {
    toggleActiveBadge(id, value);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative flex items-center justify-between border-b pb-2"
      >
        <h3 className="font-medium truncate">{title}</h3>

        <div className="flex items-center gap-2">
          <button className="order-1" onClick={toggleMenu}>
            <EllipsisVertical strokeWidth={1} fill="black" />
          </button>

          {badge && <ActiveMenuBadge badge={badge} />}
        </div>

        {menuOpen && (
          <ProjectCardMenu
            onClose={() => setMenuOpen(false)}
            onAction={onAction}
            badge={badge}
          />
        )}
      </div>

      <div className="my-4">
        <div className="mb-4">
          <ProgressBar progress={progress} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Team</p>
            <AssigneeAvatars users={users} />
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
            style={{ backgroundColor: STATUS_OPTIONS[status].color }}
            className="p-1 px-1.5 rounded-xl text-xs "
          >
            {STATUS_OPTIONS[status].label}
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
        {attachments && (
          <button className="flex items-center gap-0.5 text-muted-foreground text-sm">
            <Paperclip size={15} />
            {attachmenetIds?.length}
          </button>
        )}
        {commentIds && (
          <button className="flex items-center gap-0.5 text-muted-foreground text-sm">
            <MessageSquareMore size={15} />
            {commentIds.length}
          </button>
        )}
      </div>
    </>
  );
};
export default ProjectCard;
