import { Types, ClientSession } from "mongoose";
import { ProjectModel } from "@/features/projects/models/project.model";
import { TaskModel } from "@/features/tasks/models/task.model";

type SynchronizeProjectStatusInput = {
  projectId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  session?: ClientSession;
};

export const synchronizeProjectStatus = async ({
  projectId,
  workspaceId,
  session,
}: SynchronizeProjectStatusInput) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspaceId,
  })
    .select("_id workspaceId projectStatus")
    .session(session ?? null);

  if (!project) return;

  const taskStatuses = await TaskModel.find({
    projectId: project._id,
    workspaceId,
  })
    .select("taskStatus")
    .session(session ?? null);

  const hasOnlyDoneTasks =
    taskStatuses.length > 0 &&
    taskStatuses.every((t) => t.taskStatus === "done");

  if (hasOnlyDoneTasks) {
    await ProjectModel.updateOne(
      { _id: project._id, workspaceId },
      { $set: { projectStatus: "done" } },
      { session },
    );

    return;
  }

  const hasStartedTask = taskStatuses.some(
    (t) => t.taskStatus === "in_progress" || t.taskStatus === "done",
  );

  if (project.projectStatus === "pending" && hasStartedTask) {
    await ProjectModel.updateOne(
      { _id: project._id, workspaceId },
      { $set: { projectStatus: "in_progress" } },
      { session },
    );
  }
};
