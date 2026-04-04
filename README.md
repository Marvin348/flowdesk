# FlowDesk

FlowDesk is an admin dashboard for managing projects, tasks, and team collaboration, with a focus on structured data handling, sorting, and UI-driven workflows.

⚠️ This project is still a work in progress. Many parts are not fully refactored yet, and the overall direction and features may still evolve.

## Current Setup
- Frontend consumes a mock API using json-server
- Focus is currently on UI architecture, state management, and data flow
- Features are being developed iteratively, with ongoing refinements

## Planned Improvements
- Replace json-server with a real backend **(Node.js + Express)**
- Add persistent database (e.g. MongoDB or PostgreSQL)
- Implement custom REST API routes
- Improve overall architecture and separation of concerns

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

4. Start the mock API (json-server)

```bash
npx json-server --watch db.json --port 30001
```

## 🛠 Tech Stack

- **TypeScript**
- **React**
- **Axios**
- **Zustand** – global state management
- **react-hook-form + zod**
- **TanStack Query** – data fetching & caching
- **Tailwind CSS** – utility-first styling
- **Recharts**
- **shadcn/ui** – accessible UI components
- **React Router**
- **LocalStorage** – persistence layer
- **Lucide Icons**
