import { useGetUserSessions } from "@/features/auth/hooks/useGetUserSessions";
import SessionItem from "@/features/settings/components/security/SessionItem";

const SessionsCard = () => {
  const { data: sessions, isError } = useGetUserSessions();

  if (isError || !sessions) {
    return (
      <div className="mt-6">
        <h4 className="font-medium">Aktuelle Sitzungen</h4>

        <div className="border p-4 rounded-md">
          <p>Sitzungen konnten nicht geladen werden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium">Aktuelle Sitzungen</h4>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <SessionItem key={session.sessionId} session={session} />
        ))}
      </div>
    </div>
  );
};
export default SessionsCard;
