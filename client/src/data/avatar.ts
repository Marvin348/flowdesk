import m1 from "@/assets/avatars/avatar-m.jpg";
import m2 from "@/assets/avatars/avatar-m-2.jpg";
import m3 from "@/assets/avatars/avatar-m-3.jpg";
import m4 from "@/assets/avatars/avatar-m-4.jpg";
import m5 from "@/assets/avatars/avatar-m-5.jpg";
import m6 from "@/assets/avatars/avatar-m-6.jpg";
import m7 from "@/assets/avatars/avatar-m-7.jpg";
import m8 from "@/assets/avatars/avatar-m-8.jpg";

import f1 from "@/assets/avatars/avatar-f.jpg";
import f2 from "@/assets/avatars/avatar-f-2.jpg";
import f3 from "@/assets/avatars/avatar-f-3.jpg";
import f4 from "@/assets/avatars/avatar-f-4.jpg";
import f5 from "@/assets/avatars/avatar-f-5.jpg";
import f6 from "@/assets/avatars/avatar-f-6.jpg";
import f7 from "@/assets/avatars/avatar-f-7.jpg";
import f8 from "@/assets/avatars/avatar-f-8.jpg";
import f9 from "@/assets/avatars/avatar-f-9.jpg";
import f10 from "@/assets/avatars/avatar-f-10.jpg";
import f11 from "@/assets/avatars/avatar-f-11.jpg";

export type AvatarKey = keyof typeof AVATARS;

export const AVATARS = {
  m1,
  m2,
  m3,
  m4,
  m5,
  m6,
  m7,
  m8,
  f1,
  f2,
  f3,
  f4,
  f5,
  f6,
  f7,
  f8,
  f9,
  f10,
  f11,
} as const;
