import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import Datepicker from '../components/Datepicker';
import BarChart01 from '../charts/BarChart01.jsx';
import DoughnutChart from '../charts/DoughnutChart.jsx';
import LineChart01 from '../charts/LineChart01.jsx';
import HeatMap from '../components/HeatMap.jsx';
import { exportToCSV, exportToExcel } from '../utils/exportUtils.js';

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [team, setTeam] = useState('');
  const [range, setRange] = useState({ from: null, to: null });
  const [data, setData] = useState([]);

  const fetchReports = async () => {
    const params = {};
    if (team) params.team = team;
    if (range.from) params.start = range.from.toISOString();
    if (range.to) params.end = range.to.toISOString();
    const res = await axios.get('/api/reports', { params });
    const arr = Object.entries(res.data.data).map(([date, v]) => ({
      date,
      tasks: v.tasks,
      hours: v.hours,
    }));
    setData(arr);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const heatData = data.map((d, i) => ({
    day: d.date,
    hour: i,
    value: d.tasks,
  }));

  const exportCSV = () => {
    const rows = data.map((d) => [d.date, d.tasks, d.hours]);
    rows.unshift(['Date', 'Tasks', 'Hours']);
    exportToCSV('report.csv', rows);
  };

  const exportXLSX = () => exportToExcel('report.xlsx', data);

  return (
    <div className="flex h-screen overflow-hidden text-gray-800 dark:text-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">My Reports</h2>
          <div className="flex items-center gap-4 mb-4">
            <select
              className="select select-bordered"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
            </select>
            <Datepicker align="right" onChange={setRange} />
            <button className="btn btn-primary" onClick={fetchReports}>Apply</button>
          </div>
          {data.length > 0 && (
            <div className="space-y-6">
              <div className="h-72"><BarChart01 data={data.map(d => ({x: d.date, y: d.tasks}))} width={600} height={250} /></div>
              <div className="h-72"><DoughnutChart data={data.map(d => d.tasks)} width={300} height={250} /></div>
              <div className="h-72"><LineChart01 data={data.map(d => ({x: d.date, y: d.hours}))} width={600} height={250} /></div>
              <HeatMap data={heatData} width={600} height={200} />
              <div className="flex gap-3">
                <button className="btn" onClick={exportCSV}>Export CSV</button>
                <button className="btn" onClick={exportXLSX}>Export Excel</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Reports;
