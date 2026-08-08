type BuildTaskMetricsStagesInput = {
  startOfToday: Date;
};

export const buildTaskMetricsStages = ({
  startOfToday,
}: BuildTaskMetricsStagesInput) => [
  {
    $addFields: {
      totalTaskCount: {
        $size: { $ifNull: ["$tasks", []] },
      },

      openTaskCount: {
        $size: {
          $filter: {
            input: { $ifNull: ["$tasks", []] },
            as: "task",
            cond: {
              $in: ["$$task.taskStatus", ["pending", "in_progress"]],
            },
          },
        },
      },

      doneTaskCount: {
        $size: {
          $filter: {
            input: { $ifNull: ["$tasks", []] },
            as: "task",
            cond: {
              $eq: ["$$task.taskStatus", "done"],
            },
          },
        },
      },

      overdueTaskCount: {
        $size: {
          $filter: {
            input: { $ifNull: ["$tasks", []] },
            as: "task",
            cond: {
              $and: [
                {
                  $in: ["$$task.taskStatus", ["pending", "in_progress"]],
                },
                {
                  $lt: ["$$task.dueDate", startOfToday],
                },
              ],
            },
          },
        },
      },
    },
  },

  {
    $addFields: {
      completionRate: {
        $round: [
          {
            $cond: {
              if: { $gt: ["$totalTaskCount", 0] },
              then: {
                $multiply: [
                  {
                    $divide: ["$doneTaskCount", "$totalTaskCount"],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
          0,
        ],
      },
    },
  },
];
