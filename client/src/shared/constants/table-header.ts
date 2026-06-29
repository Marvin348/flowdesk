export const COLLABORATOR_TABLE_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Rolle", value: "role" },
] as const;

export const LIST_TABLE_OPTIONS = [
  { label: "Aufgabe", value: "task" },
  { label: "Mitarbeiter", value: "assignee" },
  { label: "Deadline", value: "dueDate" },
  { label: "Priorität", value: "priority" },
  { label: "Status", value: "status" },
  { label: "Aktion", value: "action" },
] as const;

export const WORKLOAD_TABLE_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Total", value: "totalTasks" },
  { label: "Offene", value: "openTasks" },
  { label: "Status", value: "progressStatus" },
] as const;
