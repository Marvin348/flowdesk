import { Outlet } from "react-router";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { useCoreData } from "@/queries/useCoreData";
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { projects } = useCoreData();

  return (
    <div>
      <header className="p-2 px-4 border-b lg:hidden">
        <Header onOpen={() => setSidebarOpen(true)} />
      </header>

      <div className="flex">
        <aside>
          <Sidebar onOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </aside>

        <main className="w-full p-6">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
