# FlowDesk

FlowDesk is a modern full-stack project management and workflow app focused on task management, team organization, and structured workflows.

The project focuses on real-world admin workflows such as project overview management, detailed project pages, task assignment, task status tracking, workload insights, attachment handling, workspace invitations, and backend-driven DTOs for clean frontend data consumption.

FlowDesk is actively being developed as a fullstack portfolio project with a focus on backend architecture, authentication, authorization, data modeling, file storage, testing, and clean API design.

## Tech Stack

### Backend

- **Node + Express**
- **MongoDB with Mongoose**
- **JWT authentication with HttpOnly cookies**
- **Cloudflare R2 for private file storage**
- **Resend (E-Mail Provider)**
- **Zod**
- **Vitest and Supertest for backend testing**

### Frontend

- **React with Vite**
- **TypeScript**
- **React Router**
- **TanStack Query**
- **Axios**
- **Zustand**
- **react-hook-form + zod**
- **Tailwind CSS**
- **Recharts**
- **shadcn/ui**

## Features

- User registration and login
- Email verification with hashed one-time tokens
- Cookie-based authentication using HttpOnly JWTs
- Protected backend routes with reusable authentication middleware
- Workspace-based user context
- Project overview and project detail pages
- Task management with status tracking
- Comments and project-related activity data
- File attachment upload, download, and deletion
- Private file storage using Cloudflare R2 and signed download URLs
- Workspace invite flow with token-based invitation links
- Server-side search, filtering, pagination, and DTO mapping
- Demo/development seed data for local testing

## Architecture Notes

FlowDesk uses a custom Express backend instead of a BaaS solution. The backend is responsible for authentication, authorization, validation, database access, file handling, and response shaping.

Authentication is handled through JWTs stored in HttpOnly cookies. Protected routes use a reusable requireAuth middleware that verifies the access token and attaches the authenticated user context to the request.

Most API responses are shaped through DTO and mapper functions. This keeps frontend data predictable and avoids exposing database-specific fields such as \_id, \_\_v, or internal storage keys unless needed.

Data-heavy endpoints handle filtering, search, pagination, and aggregation on the backend. The frontend consumes already structured response data and uses React Query for caching and request state management.

## Authentication & Email Verification

New users are not activated immediately after registration. During registration, the backend creates a one-time email verification token, stores only its hashed value, and sends a verification link via email.

When the user opens the verification link, the backend validates the token, checks its expiration and usage state, marks the account as verified, and only then allows the user to log in.

This separates account creation from account activation and follows a more realistic authentication flow.

## File Uploads & Downloads

FlowDesk stores uploaded files in Cloudflare R2 using S3-compatible APIs. The database stores file metadata such as filename, MIME type, file size, storage key, project reference, task reference, workspace reference, and uploader reference.

Downloads are handled through signed URLs. The backend first verifies that the authenticated user has access to the requested attachment and then redirects the user to a temporary signed download URL.

This keeps private files protected while avoiding unnecessary file streaming through the backend.

## Workspace Invites

Admins can create invite links for new workspace members. Invites are token-based, expire after a defined time, and can only be used once.

When an invited user registers through a valid invite link, they are added to the existing workspace instead of creating a new isolated workspace.

## Current Status

FlowDesk is still in active development. Core backend features such as authentication, project data, task data, file attachments, workspace context, email verification, and invite handling are already implemented or being actively refined.

The current focus is on improving route structure, service separation, backend tests, authorization checks, and production-readiness before deployment.

## Planned Improvements

- Improve workspace and role-based authorization
- Expand backend test coverage for all major routes
- Continue refactoring older routes into service-based architecture
- Improve frontend empty states and loading states
- Add more polished task and attachment interactions
- Improve profile and avatar upload handling
- Finalize production deployment setup
- Improve UI animations and layout polish
- Add more complete project activity and audit log features

## Installation

1. Clone the repository

```bash
git clone https://github.com/Marvin348/flowdesk.git
cd flowdesk
```

2. Install frontend dependencies

```bash
npm install
```

3. Install backend dependencies

```bash
cd server
npm install
```

4. Create backend environment file

The backend requires a `.env` file inside the `server` directory.

Create `server/.env`:

```env
PORT=3001
MONGODB_URL=your_mongodb_connection_string
```

5. Seed demo data

```bash
npm run seed
```

6. Start backend

```bash
npm run dev
```

7. Start frontend in a second terminal

```bash
cd client
npm run dev
```

## Screenshots

![login](./screenshots/flowdesk-login.png)
![invite](./screenshots/flowdesk-invite.png)

![dashboard](./screenshots/flowdesk-dashboard.png)
![details](./screenshots/flowdesk-details.png)
![projects](./screenshots/flowdesk-projects.png)
![add Project](./screenshots/flowdesk-addProject.png)

![attachments](./screenshots/flowdesk-attachments.png)
![settings](./screenshots/flowdesk-settings.png)
![settings-appearance](./screenshots/flowdesk-settings-appearance.png)

![collaborators](./screenshots/flowdesk-collaborator.png)
![add tasks](./screenshots/flowdesk-add-task.png)

![team details](./screenshots/flowdesk-team-details.png)
![team](./screenshots/flowdesk-team.png)
![team filter](./screenshots/flowdesk-team-filter.png)
