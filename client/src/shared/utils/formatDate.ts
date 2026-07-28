export const formatDate = (dateString: string | number) =>
  new Date(dateString).toLocaleDateString("de-DE", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
