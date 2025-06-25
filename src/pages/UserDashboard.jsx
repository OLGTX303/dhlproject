import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import Fingerprint2 from 'fingerprintjs2';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';

function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [fingerprint, setFingerprint] = useState('');
  const [tasks, setTasks] = useState([]);
  const screenshotRef = useRef(null);

  useEffect(() => {
    // generate fingerprint and enforce two-device limit using cookies
    Fingerprint2.get((components) => {
      const fp = Fingerprint2.x64hash128(components.map(c => c.value).join(''));
      setFingerprint(fp);
      const stored = Cookies.get('fingerprints');
      const list = stored ? stored.split(',') : [];
      if (!list.includes(fp)) {
        if (list.length >= 2) {
          alert('Maximum number of devices reached');
        } else {
          Cookies.set('fingerprints', [...list, fp].join(','), { expires: 365 });
        }
      }
    });

    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });

    // fetch user tasks
    axios.get('/api/tasks').then(res => setTasks(res.data.tasks || []));
  }, []);

  const checkIn = () => {
    axios.post('/api/check-in', { ...location, fingerprint });
  };

  const checkOut = () => {
    axios.post('/api/check-out', { ...location, fingerprint });
  };

  const captureAndUpload = () => {
    if (!screenshotRef.current) return;
    html2canvas(screenshotRef.current).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const ts = Date.now();
      const internalId = Cookies.get('internalId') || 'unknown';
      axios.post('/api/upload', { image, timestamp: ts, id: internalId });
    });
  };

  return (
    <div className="flex h-screen overflow-hidden" ref={screenshotRef}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 space-y-4 glass m-4">
          <div className="space-x-2">
            <button className="btn-primary" onClick={checkIn}>Check In</button>
            <button className="btn-secondary" onClick={checkOut}>Check Out</button>
            <button className="btn-secondary" onClick={captureAndUpload}>Upload Screenshot</button>
          </div>
          <h2 className="text-xl font-bold">My Tasks</h2>
          <ul className="list-disc pl-4">
            {tasks.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
