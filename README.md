# FlowDesk

FlowDesk is a fullstack project operations dashboard for managing projects, team workload, tasks, comments, and file attachments in one structured workspace.

The app focuses on real-world admin workflows: project overviews, detailed project pages, team assignment, task status tracking, workload insights, attachment handling, and backend-driven DTOs for clean frontend data consumption.

⚠️ This project is still a work in progress. Many parts are not fully refactored yet, and the overall direction and features may still evolve.

## 🚀 Current Setup

- Fullstack setup with **React (Vite)** frontend and a **custom Node.js / Express** backend
- Backend uses **MongoDB with Mongoose** as persistent database
- Authentication with **JWT stored in an HttpOnly cookie**
- Protected frontend routes using `/auth/me`
- Protected backend API routes using an authentication middleware
- Project-level authorization based on `ownerId` and project membership
- Demo data can be seeded from the previous mock data file
- Backend handles **search, filtering, pagination, and data shaping**
- Data is fetched via structured endpoints and optimized with React Query
- Features are being developed iteratively, with ongoing refinements

## 🧠 Architecture Notes

- API routes are protected on the backend with a reusable `requireAuth` middleware
- The middleware verifies the JWT from the HttpOnly cookie and attaches the authenticated user to `req.user`
- Project data is scoped by the authenticated user:
  - users can access projects they own
  - users can access projects where they are included as members/collaborators
- Filtering, search, and pagination are handled **server-side via query parameters**
- A seed script is used to load demo/development data into MongoDB
- API responses are shaped with DTO/mapper functions to avoid exposing database internals like `_id` and `__v`

### Frontend state synchronization

Frontend state is synchronized with the URL where useful, enabling:

- persistent state across refresh
- shareable links
- consistent data flow

## ⚠️ Current Limitations

- Project authorization is currently implemented on a project level only
- More advanced permissions such as workspace roles, fine-grained project permissions, or invitation flows are not implemented yet
- Newly registered users start with no project data
- Demo data is currently tied to a dedicated demo user
- The demo user is used for showcasing seeded project data and is not meant to represent a real production user model

### Current upload limitation

- File uploads are now associated with the authenticated user
- Task selection during upload is still limited and will be improved in a later branch
- User cannot select a task right now. (gets fixed in next branch)

## ⏳ Planned Improvements

- Add workspace or organization-based ownership model
- Improve dashboard empty states for newly registered users
- Avatar handling currently uses an `avatarKey`. A full profile image upload flow is planned for a later iteration.
- Add centralized error handling middleware
- Replace route-level error checks with typed application errors
- Improve API error responses for auth and profile update flows
- Add invitation flow for project members
- Refactor shared types and API contracts
- Improve caching strategy with React Query
- Add an Activity / History page for project changes, task updates, and user actions
- Move file storage to a production-ready storage solution
- Implement Framer Motion for animations
- Finalize layout/theme

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

## 🛠 Tech Stack

### Backend

- **Node + Express**

### Frontend

- **TypeScript**
- **React**
- **Axios**
- **Zustand**
- **react-hook-form + zod**
- **TanStack Query**
- **Tailwind CSS**
- **Recharts**
- **React Router**
- **shadcn/ui**

## Screenshots

![login](./screenshots/flowdesk-login.png)
![dashboard](./screenshots/flowdesk-dashboard.png)
![details](./screenshots/flowdesk-details.png)
![projects](./screenshots/flowdesk-projects.png)
![add Project](./screenshots/flowdesk-addProject.png)

![attachments](./screenshots/flowdesk-attachments.png)

![collaborators](./screenshots/flowdesk-collaborator.png)
![add tasks](./screenshots/flowdesk-add-task.png)

![team](./screenshots/flowdesk-team.png)
![team filter](./screenshots/flowdesk-team-filter.png)
