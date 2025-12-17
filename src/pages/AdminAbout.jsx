import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    content: '',
    resumePath: '', // Existing file path from backend
  });
  const [resumeFile, setResumeFile] = useState(null); // New file to upload
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch existing About data on load
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await apiService.get('/about');
        if (response.data) {
          setFormData({
            content: response.data.content || '',
            resumePath: response.data.resumePath || '',
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch about data.');
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Only capture the first file for the single resume upload
    setResumeFile(e.target.files[0] || null);
  };

  // 2. Handle Upsert Submission (Uses FormData for file)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // --- Prepare FormData for File Upload ---
    // Since the API expects 'content' (text) and 'resume' (file), we MUST use FormData.
    const data = new FormData();
    data.append('content', formData.content);

    // If a new file is selected, append it.
    if (resumeFile) {
      // The name 'resume' MUST match the name used in your backend route: upload.single("resume")
      data.append('resume', resumeFile); 
    }
    
    try {
      // Since your backend uses POST/PUT with Multer to handle UPSERT, we'll use POST.
      await apiService.post('/about', data); 
      
      // Re-fetch data to update the displayed resumePath
      const response = await apiService.get('/about');
      setFormData(prev => ({ 
        ...prev, 
        resumePath: response.data.resumePath || prev.resumePath 
      }));
      setResumeFile(null); // Clear the file input state after successful upload

      setMessage('About section and Resume updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;

  const fullResumeUrl = formData.resumePath ? `${apiService.defaults.baseURL.replace('/api', '')}${formData.resumePath}` : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Edit About & Resume</h2>
      
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">About Me Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write a detailed description about yourself..."
          />
        </div>
        
        {/* Resume File Upload */}
        <div className="border p-4 rounded bg-gray-50">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Upload/Update Resume (PDF or DOCX)
          </label>
          {fullResumeUrl && (
            <div className="mb-3 text-sm text-indigo-600">
              Current Resume: <a href={fullResumeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-800">View Current File</a>
            </div>
          )}
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {resumeFile && (
            <p className="mt-2 text-sm text-gray-600">New file selected: **{resumeFile.name}**</p>
          )}
          {!formData.resumePath && !resumeFile && (
             <p className="mt-2 text-sm text-red-500">No resume uploaded yet.</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save About Section'}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;