import { ProjectModel } from "@/features/projects/models/project.model";
import { UserProjectOptionsQuery } from "@/features/users/validators/userProjectOptionsSchema.validator";
import { UserModel } from "@/features/users/models/user.modal";
import { AppError } from "@/utils/AppError";
import { toProjectOptionDto } from "@/features/users/mappers/toProjectOption.mapper";
import { Types } from "mongoose";

type GetUserProjectOptionsInput = {
  workspaceId: Types.ObjectId;
  query: UserProjectOptionsQuery;
};

export const getUserProjectOptions = async ({
  workspaceId,
  query,
}: GetUserProjectOptionsInput) => {
  const { search, userId } = query;

  const selectedUser = await UserModel.exists({
    _id: userId,
    workspaceId,
  });

  if (!selectedUser) {
    throw new AppError("Selected user not found", 404);
  }

  const recentProjects = await ProjectModel.find({ workspaceId })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const recentProjectIds = recentProjects.map((projects) => projects._id);

  const searchProjects =
    search === ""
      ? []
      : await ProjectModel.find({
          workspaceId,
          _id: { $nin: recentProjectIds },
          title: { $regex: search, $options: "i" },
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

  const allUserIds = new Set<string>();

  for (const project of [...recentProjects, ...searchProjects]) {
    for (const userId of project.invitedUserIds) {
      allUserIds.add(userId.toString());
    }
  }

  const users = await UserModel.find({
    workspaceId,
    _id: { $in: [...allUserIds] },
  }).lean();

  const usersById = new Map(users.map((u) => [u._id.toString(), u]));

  const recent = recentProjects.map((project) =>
    toProjectOptionDto({ project, userId, usersById }),
  );

  const results = searchProjects.map((project) =>
    toProjectOptionDto({ project, userId, usersById }),
  );

  return {
    recent,
    results,
  };
};
