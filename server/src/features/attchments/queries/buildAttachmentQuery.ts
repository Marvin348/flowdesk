type BuildAttachmentQueryInput = {
  projectId: string;
  search: string;
};

export const buildAttachmentQuery = ({
  projectId,
  search,
}: BuildAttachmentQueryInput): Record<string, unknown> => {
  const query: Record<string, unknown> = {
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
