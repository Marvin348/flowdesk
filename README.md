# FlowDesk

FlowDesk is an admin dashboard for managing projects, tasks, and team collaboration, with a focus on structured data handling, sorting, and UI-driven workflows.

⚠️ This project is still a work in progress. Many parts are not fully refactored yet, and the overall direction and features may still evolve.

## Installation

1. Clone the repository

```bash
git clone <your-repo-url>
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
