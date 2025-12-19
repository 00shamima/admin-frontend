import React, { useState } from 'react';
import apiService from '../api/apiService';
import { X } from 'lucide-react'; // X icon-ukkaga

const ProjectForm = ({ project, onClose, onSuccess }) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        techStack: project?.techStack?.join(', ') || '',
        repoLink: project?.repoLink || '',
        demoLink: project?.demoLink || '',
        featured: project?.featured || false,
    });

    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState(project?.images || []);

    // Existing image-ai neekuva-tharku (frontend state update)
    const handleRemoveExisting = (imgToRemove) => {
        setExistingImages(existingImages.filter(img => img !== imgToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        // Basic fields
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('repoLink', formData.repoLink);
        data.append('demoLink', formData.demoLink);
        data.append('featured', formData.featured);
        
        // TechStack handling
        const stackArray = formData.techStack.split(',').map(s => s.trim()).filter(s => s);
        data.append('techStack', JSON.stringify(stackArray));

        // IMPORTANT: Backend-ukku endha images-ai vechukanum-nu solluroom
        if (project) {
            data.append('imagesToKeep', JSON.stringify(existingImages));
        }

        // Puthiya images upload
        newImages.forEach(img => data.append('images', img));

        try {
            if (project) await apiService.put(`/projects/${project.id}`, data);
            else await apiService.post('/projects', data);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Error saving project. Check console.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl text-gray-800 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{project ? 'Update' : 'Create'} Project</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input placeholder="Title" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <textarea placeholder="Description" className="border p-2 rounded h-24 focus:ring-2 focus:ring-blue-400 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                <input placeholder="Tech Stack (React, Node, etc.)" className="border p-2 rounded" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
                <input placeholder="GitHub Link" className="border p-2 rounded" value={formData.repoLink} onChange={e => setFormData({...formData, repoLink: e.target.value})} />
                <input placeholder="Live Link" className="border p-2 rounded" value={formData.demoLink} onChange={e => setFormData({...formData, demoLink: e.target.value})} />
                
                <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} /> Featured Project
                </label>

                {/* --- Image Preview Section --- */}
                {existingImages.length > 0 && (
                    <div className="border rounded p-2 bg-gray-50">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Current Images (Click X to remove):</p>
                        <div className="flex flex-wrap gap-2">
                            {existingImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 border rounded shadow-sm bg-white">
                                    <img 
                                        src={`${API_URL}${img}`} 
                                        alt="preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveExisting(img)}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:scale-110 transition-transform"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t pt-2">
                    <p className="text-xs text-gray-500 mb-1 font-bold">Add New Images:</p>
                    <input type="file" multiple accept="image/*" onChange={e => setNewImages(Array.from(e.target.files))} className="text-sm w-full border p-1 rounded" />
                </div>

                <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 font-bold transition-colors">Save Changes</button>
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded font-bold transition-colors">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;