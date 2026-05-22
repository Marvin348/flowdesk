# FlowDesk

FlowDesk is an admin dashboard for managing projects, tasks, and team collaboration, with a focus on structured data handling, sorting, and UI-driven workflows.

⚠️ This project is still a work in progress. Many parts are not fully refactored yet, and the overall direction and features may still evolve.

## 🚀 Current Setup

- Fullstack setup with **React (Vite)** frontend and a **custom Node.js / Express** backend
- Backend uses **MongoDB with Mongoose** as persistent database
- Demo data can be seeded from the previous mock data file
- Backend handles **search, filtering, pagination, and data shaping**
- Data is fetched via structured endpoints and optimized with React Query
- Features are being developed iteratively, with ongoing refinements

## 🧠 Architecture Notes

- Filtering, search, and pagination are handled **server-side via query parameters**
- A seed script is used to load demo/development data into MongoDB
- API responses are shaped with DTO/mapper functions to avoid exposing database internals like `_id` and `__v`

##### Frontend state is **synchronized with the URL**, enabling:

- persistent state across refresh
- shareable links
- consistent data flow

## ⚠️ Current Limitations

- No authentication system yet → user-specific data (e.g. favorites, pinned items) is handled on the frontend only
- The backend currently still uses legacy string IDs (`id`, `projectId`, `taskId`) from the original mock data structure
- MongoDB `_id` values are not exposed to the frontend yet
- FileView is intentionally commented out for now (More functionality will be added here later)

### Current upload limitation

- File uploads currently use a hardcoded `userId` (`u3`) because authentication is not implemented yet.
- In a production version, the uploader would be derived from the authenticated session/JWT instead of being sent manually or hardcoded.
- User cannot select a task right now. (gets fixed in next branch)

## ⏳ Planned Improvements

- Expand REST API with dedicated endpoints (dashboard, team details, etc.)
- Add authentication & user-based data handling (JWT)
- Improve caching strategy with React Query
- Refactor shared types and API contracts
- Add an Activity / History page for project changes, task updates, and user actions
- Refactor overall structure
- Create Attachment Tab
- Delete Domain folder completely and only handle in backend
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

<p align="center">
  <img src="./screenshots/flowdesk-dashboard.png" width="50%">
  <img src="./screenshots/flowdesk-details.png" width="50%">
</p>

<p align="center">
  <img src="./screenshots/flowdesk-projects.png" width="50%">
  <img src="./screenshots/flowdesk-collaborator.png" width="50%">
</p>

<p align="center">
  <img src="./screenshots/flowdesk-add-task.png" width="50%">
  <img src="./screenshots/flowdesk-team.png" width="50%">
</p>

![add Project](./screenshots/flowdesk-addProject.png)
![team filter](./screenshots/flowdesk-team-filter.png)
![attachments](./screenshots/flowdesk-attachments.png)
