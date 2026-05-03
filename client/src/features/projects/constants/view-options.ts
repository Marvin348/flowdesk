import {
  Pin,
  Archive,
  Star,
  SquareChartGantt,
} from "lucide-react";


export const FILTER_VIEW_OPTIONS = [
  { label: "Alle", value: "all", icon: SquareChartGantt },
  { label: "Angepinnt", value: "pinned", icon: Pin },
  { label: "Favorieten", value: "favorite", icon: Star },
  { label: "Archiviert", value: "archived", icon: Archive },
] as const;
