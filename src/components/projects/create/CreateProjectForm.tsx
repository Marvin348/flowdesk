import CollaboratorMultiSelectField from "@/components/collaborators/CollaboratorMultiSelectField";
import { Button } from "@/components/ui/button";
import SelectedPriority from "@/components/ui/select/SelectedPriority";
import SelectedStatus from "@/components/ui/select/SelectedStatus";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StatusBase } from "@/type/domain/StatusBase";
import type { Priority } from "@/type/domain/priority";

type CreateProjectFormProps = {
  onClose: () => void;
};

const CreateProjectForm = ({ onClose }: CreateProjectFormProps) => {
  const formSchema = z.object({
    title: z.string().min(3, "Titel eingeben"),
    dueDate: z.string().min(1, "Deadline wählen"),
    status: z.string(),
    priority: z.string,
    invitedUserIds: z.array(z.string()).min(1, "Mitarbeiter angeben"),
    description: z.string().optional(),
  });

  type FormFields = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      status: "pending",
      priority: "low",
      invitedUserIds: [],
      description: "",
    },
  });

  return (
    <form className="text-surface/90">
      <div>
        <div className="mt-6 grid grid-cols-2 items-center gap-6">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm">
              Projekt Name
            </label>
            <input
              {...register("title")}
              id="title"
              type="text"
              className="form-input"
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="mb-1 block text-sm">
              Deadline
            </label>
            <input
              {...register("dueDate")}
              id="dueDate"
              type="date"
              className="form-input"
            />
          </div>
          {errors.dueDate && <p>{errors.dueDate.message}</p>}
        </div>

        <div className="mt-4 grid grid-cols-2 items-center gap-6">
          <div>
            <label className="mb-1 block text-sm">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <SelectedStatus
                  value={field.value as StatusBase}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Priorität</label>
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <SelectedPriority
                  value={field.value as Priority}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-4">
          <Controller
            name="invitedUserIds"
            control={control}
            render={({ field, fieldState }) => (
              <CollaboratorMultiSelectField
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="mb-1 block text-sm">
          Beschreibung hinzufügen
        </label>
        <textarea
          {...register("description")}
          id="description"
          className="w-full h-20 p-2 resize-none rounded-md bg-surface/5"
        ></textarea>
      </div>

      <div className="mt-4 border-t pt-4 flex items-center justify-end gap-6">
        <Button
          size="sm"
          variant="outline"
          type="button"
          className="hover:bg-surface/5"
          onClick={onClose}
        >
          Schließen
        </Button>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/95 w-30"
          type="submit"
        >
          Sichern
        </Button>
      </div>
    </form>
  );
};
export default CreateProjectForm;
