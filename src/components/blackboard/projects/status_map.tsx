export const projectStatuses = [
  "active",
  "inactive",
  "building",
  "sold",
  "abandoned",
  "failed",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
