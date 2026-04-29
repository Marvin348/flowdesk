import { Outlet } from "react-router";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState } from "react";
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="p-2 px-4 border-b lg:hidden">
        <Header onOpen={() => setSidebarOpen(true)} />
      </header>

      <div className="flex min-h-screen">
        <aside className="shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto z-100">
            <Sidebar
              onOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-6">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
