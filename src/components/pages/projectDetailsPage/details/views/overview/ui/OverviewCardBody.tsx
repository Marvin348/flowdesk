const OverviewCardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 relative min-h-0">
      {children}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
export default OverviewCardBody;
