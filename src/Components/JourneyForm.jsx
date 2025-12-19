import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const JourneyForm = ({ entry, onClose, onSuccess }) => {
  const [type, setType] = useState('experience'); // experience OR education
  const [formData, setFormData] = useState({
    mainTitle: '', // role allathu degree
    subTitle: '',  // company allathu institution
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });
  const [loading, setLoading] = useState(false);

  // Edit mode-il irunthaal data-vai fill seiya
  useEffect(() => {
    if (entry) {
      const entryType = entry.role ? 'experience' : 'education';
      setType(entryType);
      setFormData({
        mainTitle: entry.role || entry.degree,
        subTitle: entry.company || entry.institution,
        description: entry.description || '',
        startDate: entry.startDate ? new Date(entry.startDate).toISOString().split('T')[0] : '',
        endDate: entry.endDate ? new Date(entry.endDate).toISOString().split('T')[0] : '',
        isCurrent: !entry.endDate,
      });
    }
  }, [entry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Prisma model-ukku etrapol payload preparation
    const payload = {
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? null : formData.endDate,
    };

    if (type === 'experience') {
      payload.role = formData.mainTitle;
      payload.company = formData.subTitle;
    } else {
      payload.degree = formData.mainTitle;
      payload.institution = formData.subTitle;
    }

    try {
      // BACKEND ENDPOINT FIX: 
      // Add seiyum pothu: /experience/experience ALLATHU /experience/education
      const endpoint = `/experience/${type}${entry ? `/${entry.id}` : ''}`;
      
      if (entry) {
        await apiService.put(endpoint, payload);
      } else {
        await apiService.post(endpoint, payload);
      }
      
      onSuccess(); // Table-ai refresh seiya
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error: " + (err.response?.data?.error || "Failed to save journey item"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg text-gray-800 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">
          {entry ? 'EDIT' : 'ADD'} <span className="text-purple-600">JOURNEY</span>
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
      </div>
      
      {/* Type Switcher (Only for new entries) */}
      {!entry && (
        <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
          <button 
            type="button"
            onClick={() => setType('experience')} 
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${type === 'experience' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            Work
          </button>
          <button 
            type="button"
            onClick={() => setType('education')} 
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${type === 'education' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            Education
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
            {type === 'experience' ? "Role (e.g. Frontend Intern)" : "Degree (e.g. B.Tech IT)"}
          </label>
          <input 
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all" 
            value={formData.mainTitle} 
            onChange={e => setFormData({...formData, mainTitle: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
            {type === 'experience' ? "Company Name" : "School/College Name"}
          </label>
          <input 
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all" 
            value={formData.subTitle} 
            onChange={e => setFormData({...formData, subTitle: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Description</label>
          <textarea 
            className="w-full border-2 border-gray-100 p-3 rounded-xl h-24 focus:border-purple-500 outline-none transition-all resize-none" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Start Date</label>
            <input 
              type="date" 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none" 
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})} 
              required 
            />
          </div>
          {!formData.isCurrent && (
            <div className="flex-1">
              <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">End Date</label>
              <input 
                type="date" 
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none" 
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
                required 
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-purple-600"
            checked={formData.isCurrent} 
            onChange={e => setFormData({...formData, isCurrent: e.target.checked})} 
          /> 
          I am currently working/studying here
        </label>

        <div className="flex gap-3 mt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-[2] bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-purple-700 disabled:bg-purple-300 transition-all"
          >
            {loading ? 'SAVING...' : 'SAVE JOURNEY'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JourneyForm;