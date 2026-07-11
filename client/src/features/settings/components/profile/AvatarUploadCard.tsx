import { Button } from "@/shared/components/ui/button";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { Trash2, Upload } from "lucide-react";
import type { AuthUser } from "@shared/types/user";
import { useUploadAvatar } from "@/features/users/hooks/profile/useUploadAvatar";
import { useDeleteAvatar } from "@/features/users/hooks/profile/useDeleteAvatar";
import { useRef } from "react";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { Spinner } from "@/shared/components/ui/spinner";

type AvatarUploadCardProps = {
  user: AuthUser;
};

const AvatarUploadCard = ({ user }: AvatarUploadCardProps) => {
  const {
    mutate: uploadAvatar,
    isPending: isUploadingAvatar,
    isError: isUploadAvatarError,
  } = useUploadAvatar();

  const {
    mutate: deleteAvatar,
    isPending: isDeletingAvatar,
    isError: isDeleteAvatarError,
  } = useDeleteAvatar();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadAvatar(file);
  };

  const handleDeleteAvatar = () => {
    deleteAvatar();
  };

  const avatarErrorMessage = isUploadAvatarError
    ? "Avatar konnte nicht hochgeladen werden."
    : isDeleteAvatarError
      ? "Avatar konnte nicht gelöscht werden."
      : null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onSelectFile}
      />

      {avatarErrorMessage && (
        <ErrorMessage message={avatarErrorMessage} className="mb-2" />
      )}

      <div className="flex flex-col gap-4 rounded-md border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              avatarKey={user.avatarKey}
              avatarUrl={user.avatarUrl}
              size="lg"
            />

            {user.avatarUrl && (
              <button
                onClick={handleDeleteAvatar}
                type="button"
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 opacity-0 size-8 bg-muted fley items-center justify-center rounded-full transition-opacity duration-200 group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

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
          disabled={isUploadingAvatar || isDeletingAvatar}
        >
          {isUploadingAvatar ? (
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
