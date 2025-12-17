import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AdminHome = () => {
  const [formData, setFormData] = useState({ title: '', subtitle: '', heroImage: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch existing data on load
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await apiService.get('/home');
        if (response.data) {
          // Fill form with existing data
          setFormData({
            title: response.data.title || '',
            subtitle: response.data.subtitle || '',
            heroImage: response.data.heroImage || '',
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch home data.');
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Handle Upsert (Create/Update) submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Use POST/PUT as your backend upsert logic handles both
      await apiService.post('/home', formData); 
      setMessage('Home section updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Update failed.');
    }
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Edit Home Section</h2>
      
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Main Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle/Tagline</label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Note: Hero Image update requires file upload (FormData). 
             For simplicity, this example only handles text fields. 
             Refer to the Projects section for full FormData example. */}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminHome;