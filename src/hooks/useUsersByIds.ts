import { useAppStore } from "@/store";
import { getArrayLookup } from "@/utils/getArrayLookup";
import { useMemo } from "react";
import { isDefined } from "@/utils/isDefined";

export const useUsersByIds = (ids: string[]) => {
  const users = useAppStore((state) => state.users);

  const usersById = useMemo(() => getArrayLookup(users), [users]);

  return ids.map((id) => usersById.get(id)).filter(isDefined);
};
