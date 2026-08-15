import CollaboratorMultiSelectField from "@/features/users/components/collaboratorsSelect/CollaboratorMultiSelectField";
import { Button } from "@/shared/components/ui/button";
import SelectedReminder from "@/shared/components/ui/select/SelectedReminder";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { Spinner } from "@/shared/components/ui/spinner";
import SelectedPriority from "@/shared/components/ui/select/SelectedPriority";
import {
  CalendarClock,
  Bell,
  Tags,
  CircleArrowRight,
  CircleArrowUp,
} from "lucide-react";
import { newTaskSchema } from "@/features/tasks/schemas/newTaskSchema";
import type { NewTaskFields } from "@/features/tasks/schemas/newTaskSchema";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useAppStore } from "@/store";
import { useTask } from "@/features/tasks/hooks/useTask";
import TaskFormSkeleton from "@/features/tasks/components/skeleton/TaskFormSkeleton";
import { useUpdateTask } from "@/features/tasks/hooks/useUpdateTask";
import { getApiErrorStatus } from "@/shared/api/getApiError";
import { getCreateTaskDefaultValues } from "@/features/tasks/utils/getCreateTaskDefaultValues";
import { mapTaskToFormValues } from "@/features/tasks/utils/mapTaskToFormValues";
import { useTaskTags } from "@/features/tasks/hooks/useTaskTags";
import { getTaskMutationErrorMessage } from "@/features/tasks/utils/getTaskMutationErrorMessage";

type AddTaskFormProps = {
  projectId: string;
  teamUserIds: string[];
};

const AddTaskForm = ({
  projectId,
  teamUserIds,
}: AddTaskFormProps) => {
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask();

  const taskId = useAppStore((state) => state.taskId);
  const mode = useAppStore((state) => state.mode);
  const closeTaskModal = useAppStore((state) => state.closeTaskModal);

  const initialCollaboratorIds = useAppStore(
  (state) => state.initialCollaboratorIds,
);

  const {
    data: task,
    isLoading,
    error,
  } = useTask(mode === "edit" ? taskId : null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<NewTaskFields>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      title: "",
      tags: [],
      reminderAt: "none",
      collaboratorIds: [],
      description: "",
      dueDate: "",
      taskPriority: "low",
    },
  });

  const { tagsInput, setTagsInput, tags, submitTag, removeTag } = useTaskTags({
    watch,
    setValue,
  });

  useEffect(() => {
    if (mode === "create") {
      reset(getCreateTaskDefaultValues(initialCollaboratorIds));
      return;
    }

    if (!task) return;

    reset(mapTaskToFormValues(task));
  }, [mode, initialCollaboratorIds, task, reset]);

  if (mode === "edit" && isLoading) {
    return <TaskFormSkeleton />;
  }

  if (mode === "edit" && error) {
    return <div>Task konnte nicht geladen werden</div>;
  }

  const handleClose = () => {
    reset();
    closeTaskModal();
  };

  const handleCreate = (values: NewTaskFields) => {
    createTaskMutation.mutate(
      { projectId, ...values },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const handleUpdate = (values: NewTaskFields) => {
    if (!taskId) return;

    updateTaskMutation.mutate(
      { taskId, values },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const onSubmit = (data: NewTaskFields) => {
    mode === "create" ? handleCreate(data) : handleUpdate(data);
  };

  const isSubmitting =
    mode === "edit"
      ? updateTaskMutation.isPending
      : createTaskMutation.isPending;

  const mutationErrors =
    mode === "edit" ? updateTaskMutation.error : createTaskMutation.error;

  const errorStatusCode = getApiErrorStatus(mutationErrors);
  const errorMessage = mutationErrors
    ? getTaskMutationErrorMessage(errorStatusCode)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-foreground">
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
              visibleUserIds={teamUserIds}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="mt-4 text-sm">
        <div className="grid grid-cols-2">
          <label htmlFor="tags" className="flex items-center gap-2">
            <Tags className="size-4" /> Tags
          </label>
          <div className="relative">
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags..."
              className="form-input pl-2 !pr-8"
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
                onClick={() => removeTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 text-sm">
        <label htmlFor="dueDate" className="flex items-center gap-2">
          <CalendarClock className="size-4" /> Datum
        </label>
        <input
          {...register("dueDate")}
          id="dueDate"
          type="date"
          placeholder="Wähle ein Datum"
          className="form-input px-2"
        />
        {errors.dueDate && (
          <p className="error-text">{errors.dueDate?.message}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 text-sm">
        <label className="flex items-center gap-2">
          <CircleArrowUp className="size-4" /> Priorität
        </label>

        <Controller
          name="taskPriority"
          control={control}
          render={({ field }) => (
            <SelectedPriority value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.taskPriority && (
          <p className="error-text">{errors.taskPriority?.message}</p>
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
        <label htmlFor="description" className="mb-1 block text-sm">
          Beschreibung hinzufügen
        </label>
        <textarea
          {...register("description")}
          id="description"
          className="w-full h-20 p-2 resize-none rounded-md bg-muted"
        />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div className="mt-4 border-t pt-4 flex items-center justify-end gap-6">
        <Button size="sm" variant="outline" type="button" onClick={handleClose}>
          Schließen
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/95 w-30"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Sichern"}
        </Button>
      </div>
    </form>
  );
};
export default AddTaskForm;
