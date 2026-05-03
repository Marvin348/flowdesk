import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/shared/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import TeamPage from "@/pages/TeamPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import AccountPage from "@/pages/AccountPage";

const queryClient = new QueryClient();

const rounter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      {
        path: "/project/:id",
        element: <ProjectDetailsPage />,
      },
      {
        path: "/team",
        element: <TeamPage />,
      },
      { path: "/account", element: <AccountPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={rounter} />
    </QueryClientProvider>
  </StrictMode>,
);
