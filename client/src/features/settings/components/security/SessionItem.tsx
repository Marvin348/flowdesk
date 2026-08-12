import { SESSION_DEVICE_ICONS } from "@/features/settings/constants/sessionDevice";
import { formatDate, formatTime } from "@/shared/utils/formatDate";
import type { UserSessionDto } from "@shared/types/dto/session/session.dto";

const SessionItem = ({ session }: { session: UserSessionDto }) => {
  const { browser, deviceType, os, createdAt, isCurrent } = session;

  const DeviceIcon = SESSION_DEVICE_ICONS[deviceType];

  return (
    <div className="pb-4 border-b last:border-b-0">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <DeviceIcon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="min-w-0 truncate text-sm font-semibold">
              {browser}
            </h4>

            {isCurrent && (
              <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Aktuelle Sitzung
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">{os}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
            <div>
              <p className="text-sm text-muted-foreground">Gerät</p>
              <p className="mt-1 text-sm font-medium capitalize">
                {deviceType}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Angemeldet</p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(createdAt)} um {formatTime(createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SessionItem;
