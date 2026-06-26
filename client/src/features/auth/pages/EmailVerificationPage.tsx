import { useParams } from "react-router";
import EmailVerificationContent from "../components/EmailVerificationContent";

const EmailVerificationPage = () => {
  const { token } = useParams();

  if (!token) return <div>Verification-Token ist ungültig.</div>;

  return <EmailVerificationContent token={token} />;
};
export default EmailVerificationPage;
