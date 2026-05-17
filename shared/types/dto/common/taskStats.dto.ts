export type TaskStatsDto = {
    pending: {
      count: number;
      percent: number;
    };
    in_progress: {
      count: number;
      percent: number;
    };
    done: {
      count: number;
      percent: number;
    };
};