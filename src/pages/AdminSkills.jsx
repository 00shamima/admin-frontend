import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import SkillForm from '../components/SkillForm'; 

// Map backend ENUM to a display array
const CATEGORIES = ['ALL', 'FRONTEND', 'BACKEND', 'DATABASE', 'TOOLS'];

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); 
  const [category, setCategory] = useState('ALL'); // State for filtering
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Fetch function
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/skills?page=${page}&limit=${limit}`;
      if (category !== 'ALL') {
        url += `&category=${category}`;
      }
      
      const response = await apiService.get(url);
      setSkills(response.data.skills || []);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Handle category change (resets to page 1)
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); 
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await apiService.delete(`/skills/${id}`);
        fetchSkills(); 
      } catch (err) {
        console.error('Failed to delete skill:', err);
        alert('Deletion failed.');
      }
    }
  };

  const totalPages = Math.ceil(total / limit);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Skills Management</h2>
      
      {/* Controls: Create Button and Category Filter */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Add New Skill
        </button>
        
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Filter by Category:</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="p-2 border rounded shadow-sm"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading skills...</p>
      ) : (
        <>
          {/* Skills Table */}
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Category</th>
                <th className="py-3 px-6 text-center">Level (%)</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{s.name}</td>
                  <td className="py-3 px-6 text-center">{s.category}</td>
                  <td className="py-3 px-6 text-center">{s.level || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(s)} className="text-blue-500 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {skills.length} of {total} total skills.
            </p>
            <div>
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className="px-3 py-1 mr-2 border rounded bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-semibold">
                Page {page} of {totalPages || 1}
              </span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 ml-2 border rounded bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Skill Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <SkillForm 
            skill={editingSkill} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchSkills(); // Refresh the list
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminSkills;