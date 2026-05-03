import { getArrayLookup } from "@/shared/utils/getArrayLookup";
import { useMemo } from "react";
import { isDefined } from "@/shared/utils/isDefined";
import { useUsers } from "@/features/users/hooks/useUsers";

export const useUsersByIds = (ids: string[]) => {
  const { data: users = [] } = useUsers();

  const usersById = useMemo(() => getArrayLookup(users), [users]);

  return ids.map((id) => usersById.get(id)).filter(isDefined);
};
