import {
  TeamActivity,
  TeamProgress,
} from "@shared/types/teamFilter/teamFilter";

type BuildTeamMembersStatsMatchStageInput = {
  activity?: TeamActivity;
  progress?: TeamProgress;
};

export const buildTeamMembersStatsMatchStage = ({
  activity,
  progress,
}: BuildTeamMembersStatsMatchStageInput) => {
  return {
    ...(activity === "active" && {
      openTasks: { $gt: 0 },
    }),

    ...(activity === "free" && {
      openTasks: 0,
    }),

    ...(progress === "critical" && {
      progressPercent: { $lt: 25 },
    }),

    ...(progress === "warning" && {
      progressPercent: { $gte: 25, $lt: 75 },
    }),

    ...(progress === "good" && {
      progressPercent: { $gte: 75 },
    }),
  };
};
