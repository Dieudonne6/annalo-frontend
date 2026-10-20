import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-paper-2">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
