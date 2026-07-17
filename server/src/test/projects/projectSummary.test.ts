import app from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAttachment,
  createAuthedUserContext,
  createComment,
  createProject,
  createTask,
  createUser,
  createWorkspace,
} from "@/test/helpers/testFactories";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

const createProjectSummaryContext = async () => {
  const { authCookie, user, userId, workspaceId } =
    await createAuthedUserContext();
  const invitedUser = await createUser({
    workspaceId,
    role: "member",
    name: "Project Member",
    avatarStorageKey: "avatars/member.jpg",
  });
  const project = await createProject({
    workspaceId,
    title: "Test Project",
    description: "A project for endpoint tests",
    ownerId: userId.toString(),
    priority: "high",
    projectStatus: "in_progress",
    dueDate: "2026-07-15",
    invitedUserIds: [invitedUser._id],
  });

  return {
    authCookie,
    invitedUser,
    invitedUserId: invitedUser._id,
    project,
    user,
    userId,
    workspaceId,
  };
};

describe("GET /projects/summaries", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app).get(`/projects/summaries`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createProjectSummaryContext();

    const response = await request(app)
      .get("/projects/summaries")
      .query({ page: "0" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid querys" });
  });

  it("returns an empty paginated list when the workspace has no projects", async () => {
    const { authCookie } = await createAuthedUserContext({
      email: "empty@example.com",
      name: "Empty User",
    });

    const response = await request(app)
      .get("/projects/summaries")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        items: [],
        pagination: {
          totalPages: 0,
          currentPage: 1,
        },
      },
    });
  });

  it("returns project summaries with task, comment, attachment, and user stats", async () => {
    const { authCookie, invitedUserId, project, userId, workspaceId } =
      await createProjectSummaryContext();

    const doneTask = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Done Task",
      dueDate: "2026-07-10",
      taskStatus: "done",
      collaboratorIds: [userId],
      taskPriority: "high",
    });
    const pendingTask = await createTask({
      workspaceId,
      projectId: project._id,
      title: "Pending Task",
      dueDate: "2026-07-11",
      taskStatus: "pending",
      collaboratorIds: [invitedUserId],
      taskPriority: "medium",
    });

    await createComment({
      workspaceId,
      taskId: doneTask._id,
      userId,
      message: "First comment",
    });
    await createComment({
      workspaceId,
      taskId: pendingTask._id,
      userId: invitedUserId,
      message: "Second comment",
    });

    await createAttachment({
      workspaceId,
      projectId: project._id,
      userId,
      fileName: "brief.pdf",
      storageKey: "projects/brief.pdf",
      mimeType: "application/pdf",
      fileSize: 1024,
    });

    const response = await request(app)
      .get("/projects/summaries")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.pagination).toEqual({
      totalPages: 1,
      currentPage: 1,
    });
    expect(response.body.data.items[0]).toMatchObject({
      id: project._id.toString(),
      title: "Test Project",
      priority: "high",
      projectStatus: "in_progress",
      dueDate: project.dueDate.toISOString(),
      invitedUserIds: [invitedUserId.toString()],
      invitedUsers: [
        {
          id: invitedUserId.toString(),
          name: "Project Member",
        },
      ],
      progress: {
        total: 2,
        completed: 1,
        progressPercent: 50,
      },
      stats: {
        commentCount: 2,
        attachmentCount: 1,
        userCount: 1,
      },
    });
  });

  it("does not return summaries from another workspace", async () => {
    const { authCookie } = await createProjectSummaryContext();
    const otherWorkspace = await createWorkspace({
      name: "Other Workspace",
    });

    await createProject({
      workspaceId: otherWorkspace._id,
      title: "Other Workspace Project",
      priority: "low",
      projectStatus: "pending",
      dueDate: "2026-08-01",
    });

    const response = await request(app)
      .get("/projects/summaries")
      .query({ search: "Other Workspace Project" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });

  it("filters summaries by search, priority, status, and attachment presence", async () => {
    const { authCookie, project, userId, workspaceId } =
      await createProjectSummaryContext();

    await createProject({
      workspaceId,
      title: "Backend Cleanup",
      ownerId: userId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: "2026-08-01",
    });
    await createProject({
      workspaceId,
      title: "Website Launch",
      ownerId: userId.toString(),
      priority: "high",
      projectStatus: "done",
      dueDate: "2026-09-01",
    });

    await createAttachment({
      workspaceId,
      projectId: project._id,
      userId,
      fileName: "roadmap.pdf",
      storageKey: "projects/roadmap.pdf",
      mimeType: "application/pdf",
      fileSize: 2048,
    });

    const response = await request(app)
      .get("/projects/summaries")
      .query({
        search: "test",
        priority: "high",
        status: "in_progress",
        hasAttachments: "true",
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      id: project._id.toString(),
      title: "Test Project",
      priority: "high",
      projectStatus: "in_progress",
      stats: {
        attachmentCount: 1,
      },
    });
  });

  it("paginates summaries with the requested page and limit", async () => {
    const { authCookie, project, userId, workspaceId } =
      await createProjectSummaryContext();

    const secondProject = await createProject({
      workspaceId,
      title: "Second Project",
      ownerId: userId.toString(),
      priority: "medium",
      projectStatus: "pending",
      dueDate: "2026-08-01",
    });
    const thirdProject = await createProject({
      workspaceId,
      title: "Third Project",
      ownerId: userId.toString(),
      priority: "low",
      projectStatus: "done",
      dueDate: "2026-09-01",
    });

    const response = await request(app)
      .get("/projects/summaries")
      .query({ page: "2", limit: "2" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect([
      project._id.toString(),
      secondProject._id.toString(),
      thirdProject._id.toString(),
    ]).toContain(response.body.data.items[0].id);
    expect(response.body.data.pagination).toEqual({
      totalPages: 2,
      currentPage: 2,
    });
  });
});
