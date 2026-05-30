import { Outlet } from "react-router";

const PublicLayout = () => {
  return (
    <main className="public-auth-bg min-h-screen">
      <Outlet />
    </main>
  );
};
export default PublicLayout;
