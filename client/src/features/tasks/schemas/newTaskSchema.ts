import z from "zod";
import { PRIORITY } from "@shared/types/priority";

export const newTaskSchema = z.object({
  title: z.string().min(3, "Titel eingeben"),
  collaboratorIds: z.array(z.string()).min(1, "Mitarbeiter angeben"),
  dueDate: z.string().min(1, "Deadline wählen"),
  tags: z
    .array(z.string().min(2, "Tag min. 2 Zeichen"))
    .max(3, "Maximal 3 Tags")
    .optional(),
  taskPriority: z.enum(PRIORITY),
  reminderAt: z.string().optional(),
  description: z.string().optional(),
});

export type NewTaskFields = z.infer<typeof newTaskSchema>;
