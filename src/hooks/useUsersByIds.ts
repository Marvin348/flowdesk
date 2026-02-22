import { getArrayLookup } from "@/utils/getArrayLookup";
import { useMemo } from "react";
import { isDefined } from "@/utils/isDefined";
import { useUsers } from "@/queries/useUsers";

export const useUsersByIds = (ids: string[]) => {
  const { data: users = [] } = useUsers();

  const usersById = useMemo(() => getArrayLookup(users), [users]);

  return ids.map((id) => usersById.get(id)).filter(isDefined);
};
