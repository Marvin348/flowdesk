import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div>
      AppLayout
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default AppLayout;
