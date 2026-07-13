export const getInviteErrorMessage = (statusCode?: number) => {
  if (statusCode === 403) {
    return "Nur Admins können Einladungen versenden.";
  }

  if (statusCode === 409) {
    return "Für diese E-Mail existiert bereits ein Account oder eine aktive Einladung.";
  }

  if (statusCode) {
    return "Die Einladung konnte nicht versendet werden. Bitte versuche es erneut.";
  }

  return null;
};
