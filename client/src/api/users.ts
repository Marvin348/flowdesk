import type { User } from "@shared/types/user";
import { apiClient } from "@/api/client";
import type { ChangeUserRoleInput } from "@shared/types/inputs/changeUserRoleInput";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await apiClient.get("/users");
  return res.data.data;
};

// old
export const changeUserRole = async (
  input: ChangeUserRoleInput,
): Promise<User> => {
  const res = await apiClient.patch(`/users/${input.id}`, {
    role: input.role,
  });
  return res.data;
};

// without axios
export const changeUserRole2 = async (
  input: ChangeUserRoleInput,
): Promise<User> => {
  try {
    const res = await fetch(`http://localhost:30001/users/${input.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: input.role,
      }),
    });

    if (!res.ok) {
      throw new Error("res was not ok");
    }

    const data: User = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
