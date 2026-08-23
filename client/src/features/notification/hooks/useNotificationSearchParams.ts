import { updateQueryParam } from "@/shared/utils/updateQueryParam";
import { DEFAULT_PAGE } from "@shared/constants/pagination";
import type { NotificationStatus } from "@shared/types/dto/notification/notification.dto";
import { useSearchParams } from "react-router";
import { notificationStatusSchema } from "@/features/notification/schemas/notificationStatusSchema";
import {
  notificationViewSchema,
  notificationFilterTypeSchema,
} from "@/features/notification/schemas/notificationFilterSchema";
import type {
  NotificationFilterType,
  NotificationView,
} from "@shared/types/notificationSettings/notificationSettings";

export const useNotificationSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;

  const statusResult = notificationStatusSchema.safeParse(
    searchParams.get("status"),
  );

  const status: NotificationStatus = statusResult.success
    ? statusResult.data
    : "all";

  const view = notificationViewSchema.parse(
    searchParams.get("view") ?? undefined,
  );

  const filterTypeResult = notificationFilterTypeSchema.safeParse(
    searchParams.get("filterType"),
  );

  const filterType = filterTypeResult.success
    ? filterTypeResult.data
    : undefined;

  const setPage = (newPage: number) =>
    setSearchParams((prev) => updateQueryParam(prev, "page", String(newPage)));

  const setNotificationStatus = (status: NotificationStatus) =>
    setSearchParams((prev) => updateQueryParam(prev, "status", status, "page"));

  const setNotificationView = (value: NotificationView) =>
    setSearchParams((prev) => updateQueryParam(prev, "view", value, "page"));

  const setFilterType = (value: NotificationFilterType) =>
    setSearchParams((prev) =>
      updateQueryParam(prev, "filterType", value, "page"),
    );

  const clearFilterType = () => {
    searchParams.delete("filterType");
    setSearchParams(searchParams);
  };

  return {
    page,
    status,
    view,
    filterType,
    actions: {
      setPage,
      setNotificationStatus,
      setNotificationView,
      setFilterType,
      clearFilterType,
    },
  };
};
