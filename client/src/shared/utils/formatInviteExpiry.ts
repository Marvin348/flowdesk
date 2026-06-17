export const formatInviteExpiry = (expiresAt: string | Date) => {
  const expiryDate = new Date(expiresAt);
  const now = new Date();

  const diffInMs = expiryDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 0) {
    return "Abgelaufen";
  } else if (diffInDays === 1) {
    return "Läuft morgen ab";
  } else {
    return `Läuft in ${diffInDays} Tagen ab`;
  }
};
