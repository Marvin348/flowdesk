export const COLLABORATOR_TABLE_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Type", value: "type" },
] as const;

export const LIST_TABLE_OPTIONS = [
  { label: "Aufgabe", value: "task" },
  { label: "Mitarbeiter", value: "assignee" },
  { label: "Deadline", value: "dueDate" },
  { label: "Priorität", value: "priority" },
] as const;

export const WORKLOAD_TABLE_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Total", value: "total" },
  { label: "Offene", value: "open" },
  { label: "Status", value: "status" },
] as const;
