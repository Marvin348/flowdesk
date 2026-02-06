import { Star, Pin, Archive } from "lucide-react";

export const PROJECT_MENU_LABEL = [
  { label: "Favorisieren", value: "favorite", icon: Star },
  { label: "Pinnen", value: "pinned", icon: Pin },
  { label: "Archivieren", value: "archived", icon: Archive },
] as const;
