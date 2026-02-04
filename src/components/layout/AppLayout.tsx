import { Outlet } from "react-router";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState } from "react";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <header className="p-2 px-4 border-b">
        <Header onOpen={() => setSidebarOpen(true)} />
      </header>

      <div className="flex">
        <aside>
          <Sidebar onOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </aside>

        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
