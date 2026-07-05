import { useParams } from "react-router";
import ChangeEmailVerificationContent from "@/features/auth/components/ChangeEmailVerificationContent";

const ConfirmEmailChangePage = () => {
  const { token } = useParams();

  if (!token) return <div>Verification-Token ist ungültig.</div>;

  return <ChangeEmailVerificationContent token={token} />;
};

export default ConfirmEmailChangePage;
