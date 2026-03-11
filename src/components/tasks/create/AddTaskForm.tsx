import CollaboratorMultiSelectField from "@/components/collaborators/CollaboratorMultiSelectField";
import { Button } from "@/components/ui/button";
import SelectedReminder from "@/components/ui/select/SelectedReminder";
import { CalendarClock, Bell, Tags, CircleArrowRight } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useCreateTask } from "@/mutations/task/useCreateTask";
import type { CreateTaskInput } from "@/type/createTaskInput";
import { Spinner } from "@/components/ui/spinner";

type AddTaskFormProps = {
  onClose: () => void;
  projectId: string;
  teamUserIds: string[];
};

const AddTaskForm = ({ onClose, projectId, teamUserIds }: AddTaskFormProps) => {
  const [tagsInput, setTagsInput] = useState("");

  const { mutate, isPending, error } = useCreateTask(projectId);

  const formSchema = z.object({
    title: z.string().min(3, "Titel eingeben"),
    collaboratorIds: z.array(z.string()).min(1, "Mitarbeiter angeben"),
    dueDate: z.string().date(),
    tags: z
      .array(z.string().min(2, "Tag min. 2 Zeichen"))
      .max(3, "Maximal 3 Tags")
      .optional(),
    reminderAt: z.string().optional(),
    description: z.string().optional(),
  });

  type FormFields = z.infer<typeof formSchema>;

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: [], reminderAt: "none", collaboratorIds: [] },
  });

  const onSubmit = (data: FormFields) => {
    const input: CreateTaskInput = {
      projectId,
      ...data,
    };

    mutate(input, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const tags = watch("tags") ?? [];

  const submitTag = () => {
    const next = tagsInput.trim();
    if (!next) return;

    if (tags.some((t) => t.toLowerCase() === next.toLowerCase())) return;

    setValue("tags", [...tags, next], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTagsInput("");
  };

  const onRemove = (tagToRemove: string) => {
    if (!tags.includes(tagToRemove)) return;

    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-surface/90">
      <div className="pb-4 border-b">
        <input
          {...register("title")}
          type="text"
          placeholder="Titel eingeben"
          className="w-full text-xl font-medium border-none outline-none focus:outline-none focus:ring-0"
        />
        {errors.title && <p className="error-text">{errors.title?.message}</p>}
      </div>

      <div className="mt-6">
        <Controller
          name="collaboratorIds"
          control={control}
          render={({ field, fieldState }) => (
            <CollaboratorMultiSelectField
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              teamUserIds={teamUserIds as string[]}
              mode="task"
            />
          )}
        />
      </div>

      <div className="mt-4 text-sm">
        <div className="grid grid-cols-2">
          <label className="flex items-center gap-2">
            <Tags className="size-4" /> Tags
          </label>
          <div className="relative">
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags..."
              className="w-full border rounded-md p-2 pr-8"
              disabled={tags.length >= 2}
            />
            {tagsInput?.length >= 2 && (
              <button
                className="absolute top-0 bottom-0 right-2"
                type="button"
                onClick={() => submitTag()}
              >
                <CircleArrowRight className="size-5 text-accent" />
              </button>
            )}
          </div>
        </div>
        {errors.tags && <p className="error-text">{errors.tags.message}</p>}

        {tags && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="px-2 bg-chart-2/20 text-chart-2 rounded-full"
                onClick={() => onRemove(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2">
          <CalendarClock className="size-4" /> Datum
        </label>
        <input
          {...register("dueDate")}
          type="date"
          placeholder="Wähle ein Datum"
          className="w-full border rounded-md p-2"
        />
        {errors.dueDate && (
          <p className="error-text">{errors.dueDate?.message}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2">
          <Bell className="size-4" /> Reminder
        </label>

        <Controller
          name="reminderAt"
          control={control}
          render={({ field }) => (
            <SelectedReminder
              value={field.value ?? "none"}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="mt-4 border-t pt-4">
        <label className="mb-1 block text-sm">Beschreibung hinzufügen</label>
        <textarea
          {...register("description")}
          className="w-full h-20 p-2 resize-none rounded-md bg-surface/5"
        />
      </div>

      <div className="mt-4 border-t pt-4 flex items-center justify-end gap-6">
        <Button
          size="sm"
          variant="outline"
          type="button"
          className="hover:bg-surface/5"
          onClick={handleClose}
        >
          Schließen
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/95 w-30"
          type="submit"
        >
          Sichern {isPending && <Spinner />}
        </Button>
      </div>
    </form>
  );
};
export default AddTaskForm;
