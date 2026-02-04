import type { Comments } from "@/type/comments";

export const mockComments: Comments[] = [
  {
    id: "c1",
    taskId: "t1",
    userId: "u1",
    message: "Ich übernehme das Layout dafür.",
    createdAt: "2026-01-28T09:15:00Z",
  },
  {
    id: "c2",
    taskId: "t1",
    userId: "u3",
    message: "Denk an die Mobile-Ansicht 🙏",
    createdAt: "2026-01-28T10:02:00Z",
  },
  {
    id: "c3",
    taskId: "t2",
    userId: "u5",
    message: "API-Doku ist noch nicht ganz aktuell.",
    createdAt: "2026-01-29T08:47:00Z",
  },
  {
    id: "c4",
    taskId: "t3",
    userId: "u2",
    message: "Bug konnte ich reproduzieren.",
    createdAt: "2026-01-30T14:21:00Z",
  },
  {
    id: "c5",
    taskId: "t4",
    userId: "u8",
    message: "Texte kommen später vom Marketing.",
    createdAt: "2026-01-31T11:05:00Z",
  },
];
