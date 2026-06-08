type BuildAttachmentQueryInput = {
  projectId: string;
  workspaceId: string;
  search: string;
};

export const buildAttachmentQuery = ({
  projectId,
  workspaceId,
  search,
}: BuildAttachmentQueryInput): Record<string, unknown> => {
  const query: Record<string, unknown> = {
    workspaceId,
    projectId,
  };

  if (search) {
    query.$or = [
      { fileName: { $regex: search, $options: "i" } },
      { mimeType: { $regex: search, $options: "i" } },
    ];
  }

  return query;
};
