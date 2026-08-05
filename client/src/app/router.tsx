import { createBrowserRouter } from "react-router";
import AppLayout from "@/shared/components/layout/AppLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import TeamPage from "@/features/users/pages/TeamPage";
import ProjectDetailsPage from "@/features/projects/pages/ProjectDetailsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import PublicLayout from "@/features/auth/routes/PublicLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";
import ProfileSettingsPage from "@/features/settings/pages/ProfileSettingsPage";
import SecuritySettingsPage from "@/features/settings/pages/SecuritySettingsPage";
import AppearanceSettingsPage from "@/features/settings/pages/AppearanceSettingsPage";
import TeamSettingsPage from "@/features/settings/pages/TeamSettingsPage";
import NotificationSettingsPage from "@/features/settings/pages/NotificationSettingsPage";
import InvitePage from "@/features/workspace-invites/pages/InvitePage";
import ActivityPage from "@/features/activity/page/ActivityPage";
import CheckEmailPage from "@/features/auth/pages/CheckEmailPage";
import EmailVerificationPage from "@/features/auth/pages/EmailVerificationPage";
import ConfirmEmailChangePage from "@/features/auth/pages/ConfirmEmailChangePage";
import ConfirmPasswordChangePage from "@/features/auth/pages/ConfirmPasswordChangePage";
import InviteSuccessPage from "@/features/workspace-invites/pages/InviteSuccessPage";
import NotificationPage from "@/features/notification/pages/NotificationPage";
import RootRedirect from "@/features/auth/routes/RootRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <RootRedirect/> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "check-email", element: <CheckEmailPage /> },
      { path: "verify-email/:token", element: <EmailVerificationPage /> },
      { path: "invite/:token", element: <InvitePage /> },
      { path: "invite/success", element: <InviteSuccessPage /> },
      {
        path: "/confirm-email-change/:token",
        element: <ConfirmEmailChangePage />,
      },
      {
        path: "/confirm-password-change/:token",
        element: <ConfirmPasswordChangePage />,
      },
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
            path: "/notifications",
            element: <NotificationPage />,
          },
          { path: "/activity", element: <ActivityPage /> },
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
