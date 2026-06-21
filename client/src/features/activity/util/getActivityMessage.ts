import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";

export const getActivityMessage = (activity: ActivityDto) => {
  switch (activity.type) {
    case "comment.created": {
      const taskTitle =
        typeof activity.metadata.taskTitle === "string"
          ? activity.metadata.taskTitle
          : "einer Aufgabe";

      return `hat einen Kommentar zu "${taskTitle}" erstellt`;
    }

    case "project.created": {
      const projectTitle =
        typeof activity.metadata.projectTitle === "string"
          ? activity.metadata.projectTitle
          : "einem Projekt";

      return `hat das Projekt "${projectTitle}" erstellt`;
    }

    case "attachment.uploaded": {
      const fileName =
        typeof activity.metadata.fileName === "string"
          ? activity.metadata.fileName
          : "eine Datei";

      return `hat "${fileName}" hochgeladen`;
    }

    case "task.created": {
      const taskTitle =
        typeof activity.metadata.taskTitle === "string"
          ? activity.metadata.taskTitle
          : "eine Aufgabe";

      return `hat die Aufgabe "${taskTitle}" erstellt`;
    }

    default:
      return "hat eine Aktion ausgeführt";
  }
};
