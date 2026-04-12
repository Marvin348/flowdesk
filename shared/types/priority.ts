export const PRIORITY = ["low", "medium", "high"] as const;

export type Priority = (typeof PRIORITY)[number];
