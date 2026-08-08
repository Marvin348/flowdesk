type DashboardCardHeaderProps = {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
};

const DashboardCardHeader = ({
  eyebrow,
  title,
  icon,
}: DashboardCardHeaderProps) => {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold">{title}</h3>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
        {icon}
      </div>
    </div>
  );
};
export default DashboardCardHeader;
