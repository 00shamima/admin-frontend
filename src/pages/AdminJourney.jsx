import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import JourneyForm from '../Components/JourneyForm'; // Changed component name

const AdminJourney = () => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  // Fetch function
  const fetchJourneyEntries = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming your backend API route is still /experience or you changed it to /journey
      const response = await apiService.get(`/experience?page=${page}&limit=${limit}`); 
      setEntries(response.data.items || []);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Failed to fetch journey entries:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchJourneyEntries();
  }, [fetchJourneyEntries]);

  const handleCreate = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journey entry?')) {
      try {
        // Assuming the DELETE route remains /experience/:id
        await apiService.delete(`/experience/${id}`); 
        fetchJourneyEntries(); 
      } catch (err) {
        console.error('Failed to delete entry:', err);
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Journey Management</h2>
      
      <button
        onClick={handleCreate}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        + Add New Journey Entry
      </button>

      {loading ? (
        <p>Loading journey entries...</p>
      ) : (
        <>
          {/* Journey Table (Displaying companyName/jobTitle as main/sub title) */}
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Company / Title</th>
                <th className="py-3 px-6 text-left">Period</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="font-semibold">{entry.jobTitle}</div>
                    <div className="text-xs text-gray-500">{entry.companyName}</div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(entry.startDate)} — {formatDate(entry.endDate)}
                  </td>
                  <td className="py-3 px-6 text-left">{entry.location}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(entry)} className="text-blue-500 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="text-red-500 hover:text-red-700">
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
              Showing {entries.length} of {total} total entries.
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

      {/* Journey Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <JourneyForm 
            entry={editingEntry} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchJourneyEntries(); // Refresh the list
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminJourney;