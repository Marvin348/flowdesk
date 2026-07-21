export const getTaskMutationErrorMessage = (error: number | undefined) => {
  if (error === 403) {
    return "Nur Admins oder Manager können Aufgaben ändern.";
  }
  if (error == 404) {
    return "Die Aufgabe wurde nicht gefunden.";
  }
  if (error === 400) {
    return "Die eingegebenen Daten sind ungültig.";
  }

  return "Die Aufgabe konnte nicht gespeichert werden.";
};
