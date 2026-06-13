import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Spinner } from "@/shared/components/ui/spinner";
import { Navigate } from "react-router";
import ProtectedApp from "@/features/auth/routes/ProtectedApp";

const ProtectedRoute = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <Spinner className="size-12 text-accent" />;

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedApp user={user} />;
};
export default ProtectedRoute;
