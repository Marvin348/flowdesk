import { Star, Pin, Archive } from "lucide-react";

export const MENU_ACTIONS = {
  favorite: { icon: Star },
  pinned: { icon: Pin },
  archived: { icon: Archive },
} as const;
