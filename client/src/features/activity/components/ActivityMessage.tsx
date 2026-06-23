import type { ActivityDto } from "@shared/types/dto/activity/activity.dto";

const ActivityMessage = ({ activity }: { activity: ActivityDto }) => {
  switch (activity.type) {
    case "comment.created": {
      const taskTitle =
        typeof activity.metadata.taskTitle === "string"
          ? activity.metadata.taskTitle
          : "einer Aufgabe";

      return (
        <>
          hat einen Kommentar zu{" "}
          <span className="font-medium text-foreground">{taskTitle}</span>{" "}
          erstellt
        </>
      );
    }

    case "attachment.uploaded": {
      const fileName =
        typeof activity.metadata.fileName === "string"
          ? activity.metadata.fileName
          : "eine Datei";

      return (
        <>
          hat <span className="font-medium text-foreground">{fileName}</span>{" "}
          hochgeladen
        </>
      );
    }

    case "attachment.deleted": {
      const fileName =
        typeof activity.metadata.fileName === "string"
          ? activity.metadata.fileName
          : "eine Datei";

      return (
        <>
          hat <span className="font-medium text-foreground">{fileName}</span>{" "}
          gelöscht
        </>
      );
    }

    case "task.created": {
      const taskTitle =
        typeof activity.metadata.taskTitle === "string"
          ? activity.metadata.taskTitle
          : "eine Aufgabe";

      return (
        <>
          hat die Aufgabe{" "}
          <span className="font-medium text-foreground">{taskTitle}</span>{" "}
          erstellt
        </>
      );
    }

    case "project.created": {
      const projectTitle =
        typeof activity.metadata.projectTitle === "string"
          ? activity.metadata.projectTitle
          : "einem Projekt";

      return (
        <>
          hat das Projekt{" "}
          <span className="font-medium text-foreground">{projectTitle}</span>{" "}
          erstellt
        </>
      );
    }

    case "project.deleted": {
      const projectTitle =
        typeof activity.metadata.projectTitle === "string"
          ? activity.metadata.projectTitle
          : "einem Projekt";

      return (
        <>
          hat das Projekt{" "}
          <span className="font-medium text-foreground">{projectTitle}</span>{" "}
          gelöscht
        </>
      );
    }

    case "workspace_invite.created": {
      const invitedEmail =
        typeof activity.metadata.invitedEmail === "string"
          ? activity.metadata.invitedEmail
          : "einen User";

      return (
        <>
          hat{" "}
          <span className="font-medium text-foreground">{invitedEmail}</span>{" "}
          eingeladen
        </>
      );
    }

    case "workspace_invite.accepted":
      return <>ist dem Workspace beigetreten</>;

    default:
      return <>hat eine Aktion ausgeführt</>;
  }
};
export default ActivityMessage;
