import type { TeamUiFilter } from "../teamFilter/teamFilter";

export type TeamMembersInput = {
  search: string;
  page: number;
  limit: number;
  filter?: TeamUiFilter;
};
