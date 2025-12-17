import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const JourneyForm = ({ entry, onClose, onSuccess }) => { // Changed prop name to 'entry'
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    description: '',
    location: '',
    startDate: '', // YYYY-MM-DD format for date input
    endDate: '',   // YYYY-MM-DD format for date input
    isCurrent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert Date objects to YYYY-MM-DD string for input[type=date]
  const dateToInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // 1. Initialize form data if editing
  useEffect(() => {
    if (entry) {
      const isCurrentJob = !entry.endDate;
      setFormData({
        companyName: entry.companyName,
        jobTitle: entry.jobTitle,
        description: entry.description,
        location: entry.location || '',
        startDate: dateToInput(entry.startDate),
        endDate: dateToInput(entry.endDate),
        isCurrent: isCurrentJob,
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isCurrent') {
        // If 'Currently Working' is checked, clear endDate
        setFormData(prev => ({ 
            ...prev, 
            isCurrent: checked,
            endDate: checked ? '' : prev.endDate // Clear endDate if checked
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare data for submission
    const dataToSend = {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      description: formData.description,
      location: formData.location,
      startDate: formData.startDate,
      // If isCurrent is true, send null for endDate. Otherwise, send the date string.
      endDate: formData.isCurrent ? null : formData.endDate, 
    };

    // Simple validation
    if (!dataToSend.startDate) {
        setError("Start Date is required.");
        setLoading(false);
        return;
    }
    if (!dataToSend.isCurrent && !dataToSend.endDate) {
        setError("End Date is required if 'Currently Working' is unchecked.");
        setLoading(false);
        return;
    }

    try {
      if (entry) {
        // Update (PUT) - assuming the backend route remains /experience/:id
        await apiService.put(`/experience/${entry.id}`, dataToSend); 
      } else {
        // Create (POST) - assuming the backend route remains /experience
        await apiService.post('/experience', dataToSend); 
      }
      onSuccess(); // Close modal and refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
      <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
        {entry ? 'Edit Journey Entry' : 'Add New Journey Entry'}
      </h3>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company and Title */}
        <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company / Institution Name" required className="w-full p-2 border rounded" />
        <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Role / Degree / Milestone Title" required className="w-full p-2 border rounded" />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., Chennai, Online)" className="w-full p-2 border rounded" />

        {/* Description */}
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Details or responsibilities (Optional)" rows="3" className="w-full p-2 border rounded" />

        {/* Date Fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              disabled={formData.isCurrent} 
              required={!formData.isCurrent} 
              className="w-full p-2 border rounded mt-1 disabled:bg-gray-200" 
            />
          </div>
        </div>

        {/* Currently Working Checkbox */}
        <div className="flex items-center pt-2">
          <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleChange} id="isCurrent" className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label htmlFor="isCurrent" className="text-gray-700">Ongoing / Current</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JourneyForm;