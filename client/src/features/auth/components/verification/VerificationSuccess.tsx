import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { LogIn, CheckCircle2 } from "lucide-react";

type VerificationSuccessProps = {
  message: string;
  title: string;
};

const VerificationSuccess = ({ message, title }: VerificationSuccessProps) => {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-accent/10 text-accent">
        <CheckCircle2 className="size-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
      <Button asChild size="lg" className="mt-6 w-full">
        <Link to="/login">
          <LogIn className="size-4" />
          Zum Login
        </Link>
      </Button>
    </div>
  );
};
export default VerificationSuccess;
