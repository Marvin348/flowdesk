export const STATUSBASE = ["pending", "in_progress", "done"] as const;

export type StatusBase = (typeof STATUSBASE)[number];
