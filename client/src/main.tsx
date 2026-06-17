import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navigate } from "react-router";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/shared/components/layout/AppLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import TeamPage from "@/pages/TeamPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import PublicLayout from "@/features/auth/routes/PublicLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ProtectedRoute from "./features/auth/routes/ProtectedRoute";
import ProfileSettingsPage from "./features/settings/pages/ProfileSettingsPage";
import SecuritySettingsPage from "./features/settings/pages/SecuritySettingsPage";
import AppearanceSettingsPage from "./features/settings/pages/AppearanceSettingsPage";
import TeamSettingsPage from "./features/settings/pages/TeamSettingsPage";
import NotificationSettingsPage from "./features/settings/pages/NotificationSettingsPage";

const queryClient = new QueryClient();

const rounter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
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
          {
            path: "/settings",
            element: <SettingsPage />,
            children: [
              { path: "profile", element: <ProfileSettingsPage /> },
              { path: "security", element: <SecuritySettingsPage /> },
              { path: "appearance", element: <AppearanceSettingsPage /> },
              { path: "team", element: <TeamSettingsPage /> },
              { path: "notification", element: <NotificationSettingsPage /> },
            ],
          },
        ],
      },
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
