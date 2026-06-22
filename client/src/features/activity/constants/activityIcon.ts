import type { ActivityType } from "@shared/types/dto/activity/activity.dto";
import {
  MessageSquareMore,
  FolderPlus,
  SquarePlus,
  Paperclip,
  UserPlus,
  UserCheck,
  SquarePen,
  type LucideIcon,
  X,
} from "lucide-react";

export const ACTIVITY_ICON = {
  "workspace_invite.created": {
    icon: UserPlus,
  },
  "workspace_invite.accepted": {
    icon: UserCheck,
  },

  "project.created": {
    icon: FolderPlus,
  },
  "project.deleted": {
    icon: X,
  },

  "task.created": {
    icon: SquarePlus,
  },
  "task.status_changed": {
    icon: SquarePen,
  },
  "task.deleted": { icon: X },

  "comment.created": {
    icon: MessageSquareMore,
  },
  "comment.deleted": { icon: X },

  "attachment.uploaded": {
    icon: Paperclip,
  },
  "attachment.deleted": { icon: X },
} satisfies Record<ActivityType, { icon: LucideIcon }>;
