import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

// Category list for the dropdown
const CATEGORIES = ['FRONTEND', 'BACKEND', 'DATABASE', 'TOOLS'];

const SkillForm = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    iconPath: '',
    category: CATEGORIES[0], // Default to the first category
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data if editing
  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level || '',
        iconPath: skill.iconPath || '',
        category: skill.category,
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare data (Ensure level is sent as a number if it exists)
    const dataToSend = {
      ...formData,
      level: formData.level ? Number(formData.level) : null,
    };
    
    try {
      if (skill) {
        // Update (PUT)
        await apiService.put(`/skills/${skill.id}`, dataToSend);
      } else {
        // Create (POST)
        await apiService.post('/skills', dataToSend);
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
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
      <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
        {skill ? 'Edit Skill' : 'Create New Skill'}
      </h3>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Skill Name (e.g., React, Express, MongoDB)" 
          required 
          className="w-full p-2 border rounded" 
        />

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <input 
          type="number" 
          name="level" 
          value={formData.level} 
          onChange={handleChange} 
          placeholder="Level (Percentage 0-100)" 
          min="0"
          max="100"
          className="w-full p-2 border rounded" 
        />
        
        {/* Icon Path (Optional) */}
        <input 
          name="iconPath" 
          value={formData.iconPath} 
          onChange={handleChange} 
          placeholder="Icon Path (e.g., /uploads/react-icon.png or SVG path)" 
          className="w-full p-2 border rounded" 
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : (skill ? 'Update Skill' : 'Create Skill')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;