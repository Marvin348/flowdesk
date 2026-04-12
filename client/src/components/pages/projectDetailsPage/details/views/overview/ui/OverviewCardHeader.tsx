type OverviewCardHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

const OverviewCardHeader = ({ title, action }: OverviewCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4 rounded-t-md">
      <h4 className="text-lg font-medium">{title}</h4>
      {action}
    </div>
  );
};
export default OverviewCardHeader;
