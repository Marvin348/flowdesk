import { updateQueryParam } from "@/shared/utils/updateQueryParam";
import { DEFAULT_PAGE } from "@shared/constants/pagination";
import type { NotificationStatus } from "@shared/types/dto/notification/notification.dto";
import { useSearchParams } from "react-router";
import { notificationStatusSchema } from "@/features/notification/schemas/notificationStatusSchema";

export const useNotificationSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;

  const statusResult = notificationStatusSchema.safeParse(
    searchParams.get("status"),
  );

  const status: NotificationStatus = statusResult.success
    ? statusResult.data
    : "all";

  const setPage = (newPage: number) =>
    setSearchParams((prev) => updateQueryParam(prev, "page", String(newPage)));

  const setNotificationStatus = (status: NotificationStatus) =>
    setSearchParams((prev) => updateQueryParam(prev, "status", status, "page"));

  return {
    page,
    status,
    actions: { setPage, setNotificationStatus },
  };
};
