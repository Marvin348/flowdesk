type CardEmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
};

const CardEmptyState = ({ icon, title, description }: CardEmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col h-full items-center justify-center rounded-2xl border border-dashed border-accent px-6 py-8 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-card shadow-md">
          {icon}
        </div>
      )}

      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
export default CardEmptyState;
