import CollaboratorMultiSelectField from "@/components/collaborators/CollaboratorMultiSelectField";
import { Button } from "@/components/ui/button";
import SelectedPriority from "@/components/ui/select/SelectedPriority";
import SelectedStatus from "@/components/ui/select/SelectedStatus";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "@/mutations/project/useCreateProject";
import { PRIORITY } from "@shared/types/priority";
import { STATUSBASE } from "@shared/types/StatusBase";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";

type CreateProjectFormProps = {
  onClose: () => void;
};

const CreateProjectForm = ({ onClose }: CreateProjectFormProps) => {
  const { mutate, isPending, error } = useCreateProject();

  const formSchema = z.object({
    title: z.string().min(3, "Titel eingeben"),
    dueDate: z.string().min(1, "Deadline wählen"),
    projectStatus: z.enum(STATUSBASE),
    priority: z.enum(PRIORITY),
    invitedUserIds: z.array(z.string()).min(1, "Mitarbeiter angeben"),
    description: z.string().optional(),
  });

  type FormFields = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      projectStatus: "pending",
      priority: "low",
      invitedUserIds: [],
      description: "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const input = {
      ...data,
    };

    mutate(input, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-surface/90">
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
              placeholder="Name"
            />
            {errors.title && (
              <p className="mt-1 error-text">{errors.title.message}</p>
            )}
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
            {errors.dueDate && (
              <p className="mt-1 error-text">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 items-center gap-6">
          <div>
            <label className="mb-1 block text-sm">Status</label>
            <Controller
              name="projectStatus"
              control={control}
              render={({ field }) => (
                <SelectedStatus value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Priorität</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <SelectedPriority
                  value={field.value}
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
export default CreateProjectForm;
