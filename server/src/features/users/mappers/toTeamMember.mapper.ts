import { TeamMemberDto } from "@shared/types/dto/users/user";
import mongoose from "mongoose";
import { UserRole } from "@shared/types/user";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";

type TeamMemberAggregationResult = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  jobTitle?: string;
  avatarStorageKey?: string;
  avatarKey?: string;
  tasksCount: number;
  completedCount: number;
  openTasks: number;
  progressPercent: number;
};

export const toTeamMemberDto = (
  member: TeamMemberAggregationResult,
): TeamMemberDto => ({
  id: member._id.toString(),
  name: member.name,
  email: member.email,
  role: member.role,
  jobTitle: member.jobTitle,
  avatarKey: member.avatarKey,
  avatarUrl: bulidPublicFileUrl(member.avatarStorageKey),
  stats: {
    completedCount: member.completedCount,
    openTasks: member.openTasks,
    progressPercent: member.progressPercent,
    tasksCount: member.tasksCount,
  },
});
