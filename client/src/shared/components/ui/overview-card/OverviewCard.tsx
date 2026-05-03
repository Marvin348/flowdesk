const OverviewCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col border rounded-md">{children}</div>
  );
};
export default OverviewCard;
