import { useParams } from "react-router";
import ChangePasswordVerificationContent from "@/features/auth/components/ChangePasswordVerificationContent";

const ConfirmPasswordChangePage = () => {
  const { token } = useParams();

  if (!token) return <div>Verification-Token ist ungültig.</div>;

  return <ChangePasswordVerificationContent token={token} />;
};
export default ConfirmPasswordChangePage;
