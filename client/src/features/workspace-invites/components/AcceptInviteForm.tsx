import {
  ArrowRight,
  Building2,
  CalendarClock,
  Mail,
  UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { acceptInviteSchema } from "@/features/workspace-invites/schemas/acceptInviteSchema";
import type { AcceptInviteFields } from "@/features/workspace-invites/schemas/acceptInviteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/ui/FormInput";
import type { WorkspaceInvitePreviewDto } from "@shared/types/dto/workspace-invites/workspace-invites";
import { formatInviteExpiry } from "@/shared/utils/formatInviteExpiry";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { PasswordInput } from "@/shared/components/ui/PasswordInput";
import { useAcceptWorkspaceInvite } from "@/features/workspace-invites/hooks/useAcceptWorkspaceInvite";
import { useNavigate } from "react-router";
import { Spinner } from "@/shared/components/ui/spinner";

type AcceptInviteFormProps = {
  invite: WorkspaceInvitePreviewDto;
  token: string;
};

const AcceptInviteForm = ({ invite, token }: AcceptInviteFormProps) => {
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useAcceptWorkspaceInvite();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFields>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = (data: AcceptInviteFields) => {
    const input = {
      token,
      input: data,
    };

    mutate(input, {
      onSuccess: () => {
        navigate("/invite/success", { replace: true });
        reset();
      },
    });
  };

  const { email, workspaceName, expiresAt } = invite;
  const expiresLabel = formatInviteExpiry(expiresAt);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8 text-foreground sm:px-8">
      <section className="w-full max-w-lg rounded-md border bg-card shadow-sm">
        <div className="border-b px-6 py-5 sm:px-8">
          <div className="mb-4 text-right">
            <span className="rounded-md border border-accent/50 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
              Einladung
            </span>
          </div>

          <h1 className="text-2xl font-semibold">Einladung annehmen</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Richte deinen Zugang ein, um dem Workspace beizutreten.
          </p>
        </div>

        <div className="grid gap-3 border-b bg-muted/30 px-6 py-4 text-sm sm:px-8">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Workspace</p>
              <p className="truncate font-medium">{workspaceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarClock className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Gültig bis</p>
              <p className="font-medium">{expiresLabel}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-6 sm:px-8"
        >
          <div>
            <FormInput
              id="invite-name"
              label="Name"
              type="text"
              autoComplete="name"
              placeholder="Max Mustermann"
              icon={<UserRound className="size-4" />}
              {...register("name")}
            />
            <ErrorMessage message={errors.name?.message} className="mt-1" />
          </div>

          <div>
            <div className="space-y-2">
              <p className="mb-1.5 block text-sm">Email</p>
              <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          <div>
            <PasswordInput
              id="invite-password"
              label="Passwort"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("password")}
            />
            <ErrorMessage message={errors.password?.message} className="mt-1" />
          </div>

          {isError && (
            <ErrorMessage message="Etwas ist schief gelaufen.Bitte versuche es erneut." />
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending || isSubmitting}
          >
            <span className="flex items-center gap-2">
              Einladung akzeptieren{" "}
              {isPending ? (
                <Spinner className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </span>
          </Button>
        </form>
      </section>
    </div>
  );
};

export default AcceptInviteForm;
