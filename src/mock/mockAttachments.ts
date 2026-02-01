import type { Attachment } from "@/type/attachment";

export const mockAttachments: Attachment[] = [
  {
    id: "a1",
    taskId: "t1",
    fileName: "wireframe-home.png",
    url: "https://example.com/files/wireframe-home.png",
  },
  {
    id: "a2",
    taskId: "t2",
    fileName: "api-spec.yaml",
    url: "https://example.com/files/api-spec.yaml",
  },
  {
    id: "a3",
    taskId: "t3",
    fileName: "error-log.txt",
    url: "https://example.com/files/error-log.txt",
  },
  {
    id: "a4",
    taskId: "t4",
    fileName: "content-draft.docx",
    url: "https://example.com/files/content-draft.docx",
  },
  {
    id: "a5",
    taskId: "t5",
    fileName: "roadmap.pdf",
    url: "https://example.com/files/roadmap.pdf",
  },
];
