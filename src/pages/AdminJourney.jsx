import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import JourneyForm from '../Components/JourneyForm';
import { Trash2, Edit } from 'lucide-react';

const AdminJourney = () => {
  const [data, setData] = useState({ experiences: [], educations: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const loadData = async () => {
    try {
      const res = await apiService.get('/journey'); // Make sure backend has this route
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const deleteItem = async (type, id) => {
    if (window.confirm("Delete this?")) {
      await apiService.delete(`/${type}/${id}`);
      loadData();
    }
  };

  const Table = ({ title, items, type }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3 text-purple-700 uppercase tracking-wider">{title}</h3>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Title / Subtitle</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{item.role || item.degree}</div>
                  <div className="text-sm text-gray-500">{item.company || item.institution}</div>
                </td>
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button onClick={() => { setEditingEntry(item); setIsModalOpen(true); }} className="text-blue-500"><Edit size={18}/></button>
                  <button onClick={() => deleteItem(type, item.id)} className="text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800">JOURNEY MANAGEMENT</h1>
        <button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }} className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">+ ADD NEW</button>
      </div>

      <Table title="Work Experience" items={data.experiences} type="experience" />
      <Table title="Education" items={data.educations} type="education" />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <JourneyForm entry={editingEntry} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); loadData(); }} />
        </div>
      )}
    </div>
  );
};

export default AdminJourney;