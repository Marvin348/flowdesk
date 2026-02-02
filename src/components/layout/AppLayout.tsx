import { Outlet } from "react-router";
import Sidebar from "@/components/layout/Sidebar";

const AppLayout = () => {
  return (
    <div>
      AppLayout
      <main>
        <div>
          <Outlet />
        </div>

        <aside>
          <Sidebar />
        </aside>
      </main>
    </div>
  );
};
export default AppLayout;
