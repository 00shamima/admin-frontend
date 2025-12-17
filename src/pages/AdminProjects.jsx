import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../api/apiService';
import ProjectForm from '../components/ProjectForm'; // We will create this next

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Matches the default limit in your backend
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch function using useCallback to avoid unnecessary re-renders
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/projects?page=${page}&limit=${limit}`);
      setProjects(response.data.items || []);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handler for opening the modal for creation
  const handleCreate = () => {
    setEditingProject(null); // Clear any previous editing data
    setIsModalOpen(true);
  };

  // Handler for opening the modal for editing
  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Handler for deleting a project
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiService.delete(`/projects/${id}`);
        // Refresh the list after deletion
        fetchProjects(); 
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Deletion failed.');
      }
    }
  };

  // Pagination Controls
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Projects Management</h2>
      <button
        onClick={handleCreate}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        + Add New Project
      </button>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Tech Stack</th>
                <th className="py-3 px-6 text-center">Featured</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{p.title}</td>
                  <td className="py-3 px-6 text-left">
                    {p.techStack.join(', ').substring(0, 30)}...
                  </td>
                  <td className="py-3 px-6 text-center">
                    {p.featured ? 'Yes' : 'No'}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
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
              Showing {projects.length} of {total} total projects.
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

      {/* Project Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <ProjectForm 
            project={editingProject} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchProjects(); // Refresh the list
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProjects;