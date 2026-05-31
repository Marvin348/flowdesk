import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Spinner } from "@/shared/components/ui/spinner";
import { Navigate } from "react-router";
import { Outlet } from "react-router";

const ProtectedRoute = () => {
  const { data, isLoading, error } = useCurrentUser();

  if (isLoading) return <Spinner className="size-12 text-accent"/>;

  if (error || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
