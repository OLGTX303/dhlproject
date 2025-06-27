import { useState } from 'react';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';

const taskOptions = ['UI Fixes', 'Review PR', 'Bug Triage', 'Project SP', 'API Integration', 'Code Review'];

const generateRandomDate = (index) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - index);
  return pastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const generateRandomTime = () => {
  const hour = 8 + Math.floor(Math.random() * 3); // 8 AM to 10 AM
  const minute = Math.floor(Math.random() * 60);
  return `${hour}:${minute.toString().padStart(2, '0')} AM`;
};

const generateRandomRows = (count = 6) => {
  return Array.from({ length: count }, (_, i) => {
    const status = Math.random() > 0.2 ? 'Present' : 'Absent';
    const sync = Math.random() > 0.3 ? 'Synced' : 'Pending';
    const time = status === 'Present' ? generateRandomTime() : '-';
    const task = status === 'Present' ? taskOptions[Math.floor(Math.random() * taskOptions.length)] : '-';

    return {
      date: generateRandomDate(i),
      status,
      time,
      task,
      sync,
    };
  });
};

function EditActivity() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rows, setRows] = useState(generateRandomRows());
  const [conflict, setConflict] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleSyncNow = () => {
    const newRows = rows.map(row =>
      row.sync === 'Pending' ? { ...row, sync: 'Synced' } : row
    );
    setRows(newRows);
  };

  const handleConflict = () => {
    setConflict({
      local: { status: 'Present', task: 'Project SP', time: '9:00 AM' },
      server: { status: 'Absent', task: '-', time: '9:10 AM' },
    });
  };

  const resolveConflict = (choice) => {
    setFeedback(`✅ Resolved using ${choice === 'local' ? 'Local' : 'Server'} version.`);
    setConflict(null);
    setTimeout(() => setFeedback(''), 3000);
  };
  
  const handleNewSync = () => {
    setRows(generateRandomRows());
    setConflict(null);
    setFeedback('🔄 New data synced successfully.');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden   ">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-amber-50 ">📅 Event Sync Log</h2>

          {feedback && (
            <div className="p-4 rounded-lg bg-green-100 text-green-800 shadow flex items-center justify-between">
              <span>{feedback}</span>
              <button onClick={() => setFeedback('')} className="text-lg font-bold px-2">×</button>
            </div>
          )}

          <div className="overflow-x-auto backdrop-blur-sm glass bg-white/40 rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="text-gray-700 bg-white/60 backdrop-blur">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Sync State</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/20 transition border-t border-white/30">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className={`px-4 py-3 font-semibold ${row.status === 'Present' ? 'text-green-600' : 'text-red-500'}`}>
                      {row.status}
                    </td>
                    <td className="px-4 py-3">{row.time}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-amber-50">{row.task}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          row.sync === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {row.sync}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700" onClick={handleSyncNow}>
              Sync Now
            </button>
            <button className="px-6 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600" onClick={handleConflict}>
              Simulate Conflict
            </button>
            <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600" onClick={handleNewSync}>
              🔄 Sync New Data
            </button>
          </div>

          {conflict && (
            <div className="p-6 mt-6 rounded-xl  backdrop-blur border shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Attendance Conflict Detected</h3>
              <table className="min-w-full border text-sm">
                <thead className="bg-white/60">
                  <tr>
                    <th className="px-4 py-2 border">Version</th>
                    <th className="px-4 py-2 border">Check-in</th>
                    <th className="px-4 py-2 border">Task</th>
                    <th className="px-4 py-2 border">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-bold text-indigo-600">Local</td>
                    <td className="px-4 py-2 border text-green-600">{conflict.local.status}</td>
                    <td className="px-4 py-2 border">{conflict.local.task}</td>
                    <td className="px-4 py-2 border">{conflict.local.time}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-bold text-indigo-600">Server</td>
                    <td className="px-4 py-2 border text-red-600">{conflict.server.status}</td>
                    <td className="px-4 py-2 border">{conflict.server.task}</td>
                    <td className="px-4 py-2 border">{conflict.server.time}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 flex gap-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700" onClick={() => resolveConflict('local')}>
                  ✅ Keep Local
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700" onClick={() => resolveConflict('server')}>
                  🌐 Keep Server
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EditActivity;
