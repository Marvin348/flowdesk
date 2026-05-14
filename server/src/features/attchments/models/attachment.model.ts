import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  id: {
    // id gets removed later
    type: String,
    required: true,
    unique: true,
  },

  taskId: {
    type: String,
    require: true,
    unique: true,
  },

  userId: {
    type: String,
    require: true,
    unique: true,
  },

  fileName: {
    type: String,
  },

  url: {
    type: String,
  },
});

export const AttachmentModal = mongoose.model("Attachment", attachmentSchema);
