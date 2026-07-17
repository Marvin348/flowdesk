import { AttachmentModel } from "@/features/attachments/models/attachment.model";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper";

export const getAttachmentDtosByProjectId = async (projectId: string) => {
  const attachmentRecords = await AttachmentModel.find({ projectId }).lean();

  return attachmentRecords.map(toAttachmentDto);
};
