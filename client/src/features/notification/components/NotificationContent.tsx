type NotificationContentProps = {
  children: React.ReactNode;
};

const NotificationContent = ({ children }: NotificationContentProps) => {
  return (
    <div className="mt-6 grid flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {children}
    </div>
  );
};
export default NotificationContent;
