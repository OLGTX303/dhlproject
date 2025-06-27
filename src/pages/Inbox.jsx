import { useState } from 'react';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';

function Inbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messages = [
    { id: 1, title: 'Welcome', content: 'This is your inbox.' },
    { id: 2, title: 'Update', content: 'New features added.' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h2 className="font-semibold">{m.title}</h2>
                <p>{m.content}</p>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default Inbox;
