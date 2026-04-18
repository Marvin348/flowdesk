# FlowDesk

FlowDesk is an admin dashboard for managing projects, tasks, and team collaboration, with a focus on structured data handling, sorting, and UI-driven workflows.

⚠️ This project is still a work in progress. Many parts are not fully refactored yet, and the overall direction and features may still evolve.

## Current Setup

- Frontend (React + Vite) connected to a custom Node.js backend
- Backend is still evolving; some endpoints and data flows may be incomplete or inconsistent
- Focus is currently on UI architecture, state management, and data flow
- Features are being developed iteratively, with ongoing refinements

## Notes

- Some features may not work as expected yet
- Ongoing refactoring of API structure and data handling
- shared types folder are not fully connected to server and client yet

## Planned Improvements

- Stabilize and finalize backend API design
- Add persistent database (e.g. MongoDB or PostgreSQL)
- Implement custom REST API routes
- Optimize data fetching with dedicated endpoints (e.g. dashboard, summaries, team)
- Improve overall architecture and separation of concerns
- react query chache
- organize shared folder with types

## Installation

1. Clone the repository

```bash
git clone https://github.com/Marvin348/flowdesk.git
cd flowdesk
```

2. Install dependencies

```bash
npm install
```

3. Start the frontend

```bash
npm run dev
```

4. Start backend

```bash
cd server
npm run dev
```

## 🛠 Tech Stack

### Backend

- **Node + Express**

### Frontend

- **TypeScript**
- **React**
- **Axios**
- **Zustand** – global state management
- **react-hook-form + zod**
- **TanStack Query** – data fetching & caching
- **Tailwind CSS** – utility-first styling
- **Recharts**
- **React Router**
- **shadcn/ui** – accessible UI components
- **Lucide Icons**
