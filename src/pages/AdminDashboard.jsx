import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { useState } from 'react';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 glass m-4">
          <h2 className="text-xl font-bold mb-4">Admin Interface</h2>
          <p>Manage users and tasks here.</p>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
