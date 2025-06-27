import { useState } from 'react';
import axios from 'axios';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';

function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [gender, setGender] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:3008/search', {
        userId,
        name,
        classValue,
        gender,
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" className="input input-bordered" />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input input-bordered" />
            <input value={classValue} onChange={e => setClassValue(e.target.value)} placeholder="Class" className="input input-bordered" />
            <input value={gender} onChange={e => setGender(e.target.value)} placeholder="Gender" className="input input-bordered" />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          {results.length > 0 && (
            <table className="min-w-full text-sm table-auto bg-white rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Class</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Image</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.user_id} className="border-t">
                    <td className="px-4 py-2">{r.user_id}</td>
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.class}</td>
                    <td className="px-4 py-2">{r.gender}</td>
                    <td className="px-4 py-2">{r.image && <img src={`data:image/jpeg;base64,${r.image}`} alt="user" className="w-16 h-16 object-cover" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}

export default SearchPage;
