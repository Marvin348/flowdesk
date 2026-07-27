import type { NotificationDto } from "@shared/types/dto/notification/notification.dto";

const getActorName = (notification: NotificationDto) =>
  notification.actor?.name ?? "Ein Teammitglied";

const getTaskTitle = (notification: NotificationDto) =>
  notification.task?.title ?? "Unbekannte Aufgabe";

const getProjectTitle = (notification: NotificationDto) =>
  notification.project?.title ?? "Unbekanntes Projekt";

const roleLabels = {
  admin: "Admin",
  manager: "Manager",
  member: "Mitglied",
};

const NotificationMessage = ({
  notification,
}: {
  notification: NotificationDto;
}) => {
  const actorName = getActorName(notification);
  const taskTitle = getTaskTitle(notification);
  const projectTitle = getProjectTitle(notification);
  const currentRole = notification.metadata?.currentRole
    ? roleLabels[notification.metadata.currentRole]
    : "eine neue Rolle";
  const previousRole = notification.metadata?.previousRole
    ? roleLabels[notification.metadata.previousRole]
    : "deiner vorherigen Rolle";

  switch (notification.type) {
    case "task_assigned":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Du wurdest einer Aufgabe zugewiesen
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> hat dir die Aufgabe{" "}
            <span>{taskTitle}</span> zugewiesen.
          </p>
        </div>
      );

    case "task_due_soon":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Aufgabe bald fällig
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> erinnert dich daran, dass die Aufgabe{" "}
            <span>{taskTitle}</span> bald fällig ist.
          </p>
        </div>
      );

    case "task_overdue":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Aufgabe überfällig
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> weist dich darauf hin, dass die Aufgabe{" "}
            <span>{taskTitle}</span> überfällig ist.
          </p>
        </div>
      );

    case "project_assigned":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Du wurdest einem Projekt zugewiesen
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> hat dich dem Projekt{" "}
            <span>{projectTitle}</span> hinzugefügt.
          </p>
        </div>
      );

    case "project_due_soon":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Projekt bald fällig
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> erinnert dich daran, dass das Projekt{" "}
            <span>{projectTitle}</span> bald fällig ist.
          </p>
        </div>
      );

    case "comment_mention":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Neue Erwähnung
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> hat dich in einem Kommentar erwähnt.
          </p>
        </div>
      );

    case "comment_reply":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Neue Antwort
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> hat auf deinen Kommentar geantwortet.
          </p>
        </div>
      );

    case "role_changed":
      return (
        <div className="truncate">
          <h4 className="truncate text-sm font-medium text-foreground">
            Deine Rolle wurde geändert zu <span>{currentRole}</span>
          </h4>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            <span>{actorName}</span> hat deine Rolle von{" "}
            <span>{previousRole}</span> zu <span>{currentRole}</span> geändert.
          </p>
        </div>
      );
  }
};
export default NotificationMessage;
