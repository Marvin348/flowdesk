type VerificationCardProps = {
  children: React.ReactNode;
};

const VerificationCard = ({ children }: VerificationCardProps) => {
  return (
    <section className="flex min-h-screen items-center justify-center px-5 py-6 text-foreground">
      <div className="w-full max-w-sm rounded-md border bg-card p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </section>
  );
};
export default VerificationCard;
