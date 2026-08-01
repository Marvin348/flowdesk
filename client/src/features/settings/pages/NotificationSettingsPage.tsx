import NotificationSettingsCard from "@/features/notification/components/settings/NotificationSettingsCard";

const NotificationSettingsPage = () => {
  return (
    <div>
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Benachrichtigungen</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Lege fest, worüber FlowDesk dich informieren soll.
        </p>
      </div>

      <NotificationSettingsCard />
    </div>
  );
};
export default NotificationSettingsPage;
