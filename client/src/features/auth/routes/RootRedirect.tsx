import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Spinner } from "@/shared/components/ui/spinner";
import { Navigate } from "react-router";
import { getStartViewPath } from "@/shared/lib/getStartViewPath";

const RootRedirect = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <Spinner className="size-12 text-accent" />;

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  const starterPath = getStartViewPath(user.settings.appearance.startView);

  return <Navigate to={starterPath} replace />;
};
export default RootRedirect;
