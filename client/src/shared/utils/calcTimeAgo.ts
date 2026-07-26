import { formatDate } from "./formatDate";

export const calcTimeAgo = (date: string) => {
  const now = new Date();
  const dateString = new Date(date);

  const diff = now.getTime() - dateString.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} min`;
  if (hours < 24) return `vor ${hours} h`;

  if (days < 3) {
    return days === 1 ? "Vor 1 Tag" : `Vor ${days} Tagen`;
  }
  
  return formatDate(date);
};
