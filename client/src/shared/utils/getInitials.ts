export const getInitials = (name: string) => {
  const trimmed = name.trim();
  const parts = trimmed.split(" ");
  const words = parts.filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();

  const first = words[0][0];
  const last = words[words.length - 1][0];

  return (first + last).toUpperCase();
};
