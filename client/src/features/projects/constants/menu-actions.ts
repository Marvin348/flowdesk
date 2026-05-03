import { Star, Pin, Archive } from "lucide-react";

export const MENU_ACTIONS = {
  favorite: { label: "Favorisieren", value: "favorite", icon: Star },
  pinned: { label: "Pinnen", value: "pinned", icon: Pin },
  archived: { label: "Archivieren", value: "archived", icon: Archive },
} as const;
