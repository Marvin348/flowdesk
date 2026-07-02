import { Button } from "@/shared/components/ui/button";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { Upload } from "lucide-react";
import type { AuthUser } from "@shared/types/user";
import { useUploadAvatar } from "@/features/users/hooks/useUploadAvatar";
import { useRef } from "react";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Spinner } from "@/shared/components/ui/spinner";

type AvatarUploadCardProps = {
  user: AuthUser;
};

const AvatarUploadCard = ({ user }: AvatarUploadCardProps) => {
  const { mutate, isPending, isError } = useUploadAvatar();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    mutate(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onSelectFile}
      />

      {isError && (
        <ErrorMessage
          message="Datei konnte nicht hochgeladen werden."
          className="mb-2"
        />
      )}

      <div className="flex flex-col gap-4 rounded-md border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            avatarKey={user.avatarKey}
            avatarUrl={user.avatarUrl}
            size="lg"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              JPG, PNG oder WebP. Maximal 2 MB.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4" /> Wird hochgeladen
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="size-4" />
              Hochladen
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
export default AvatarUploadCard;
