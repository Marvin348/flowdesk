export const formatDate = (dateString: string | number) =>
  new Date(dateString).toLocaleDateString("de-DE", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
