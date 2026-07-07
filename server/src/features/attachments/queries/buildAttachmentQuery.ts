import { Types } from "mongoose";

type BuildAttachmentQueryInput = {
  projectId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  search: string;
};

export const buildAttachmentQuery = ({
  projectId,
  workspaceId,
  search,
}: BuildAttachmentQueryInput) => {
  return {
    workspaceId,
    projectId,
    ...(search && {
      $or: [
        { fileName: { $regex: search, $options: "i" } },
        { mimeType: { $regex: search, $options: "i" } },
      ],
    }),
  };
};
