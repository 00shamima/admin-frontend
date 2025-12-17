import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';

const ProjectForm = ({ projectToEdit }) => {
    const navigate = useNavigate();
    const isEditMode = !!projectToEdit;
    
    // Initial state based on whether we are editing or creating
    const [formData, setFormData] = useState({
        title: projectToEdit?.title || '',
        description: projectToEdit?.description || '',
        techStack: projectToEdit?.techStack?.join(', ') || '', // Convert array to string for input
        repoLink: projectToEdit?.repoLink || '',
        demoLink: projectToEdit?.demoLink || '',
        featured: projectToEdit?.featured || false,
    });
    
    const [images, setImages] = useState([]); // File object array for new uploads
    const [existingImages, setExistingImages] = useState(projectToEdit?.images || []); // Paths for existing images
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Handlers ---
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        // Concatenate new files with existing files for multiple uploads
        setImages(prev => [...prev, ...Array.from(e.target.files)]);
        e.target.value = null; // Clear input so same file can be selected again
    };

    const handleRemoveNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (pathToRemove) => {
        // Remove the path from the list of existing images to keep
        setExistingImages(prev => prev.filter(path => path !== pathToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 1. Create FormData object
        const data = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => {
            // Special handling for techStack (send as JSON string or array if not empty)
            if (key === 'techStack') {
                const stackArray = formData.techStack.split(',').map(s => s.trim()).filter(s => s.length > 0);
                data.append(key, JSON.stringify(stackArray));
            } else {
                data.append(key, formData[key]);
            }
        });
        
        // Append existing image paths to keep (for the PUT/update endpoint)
        if (isEditMode) {
            data.append('imagesToKeep', JSON.stringify(existingImages));
        }

        // Append new image files
        images.forEach((file, index) => {
             // 'images' must match the Multer field name in uploadMiddleware.js
            data.append('images', file); 
        });

        // 2. Determine API call (POST or PUT)
        try {
            if (isEditMode) {
                await apiService.put(`/projects/${projectToEdit.id}`, data);
            } else {
                await apiService.post('/projects', data);
            }
            
            navigate('/admin/projects'); // Redirect on success
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save project. Check API.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-600">
                {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>
            {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}

            {/* Title & Description */}
            {/* ... (Input fields for title, description, links, techStack) ... */}

            {/* Featured Checkbox */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                    Featured Project
                </label>
            </div>

            {/* Image Management */}
            <div className="border p-4 rounded-md">
                <h3 className="text-lg font-medium mb-3">Project Images</h3>
                
                {/* Existing Images Display (for Edit mode) */}
                {isEditMode && existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                        <p className="w-full text-sm text-gray-500">Existing Images (click to remove):</p>
                        {existingImages.map((path, index) => (
                            <div key={path} className="relative group">
                                <img 
                                    src={`${import.meta.env.VITE_API_BASE_URL}${path}`} // Adjust path to show image
                                    alt={`Existing ${index}`} 
                                    className="w-24 h-24 object-cover rounded cursor-pointer border-2 border-green-500"
                                    onClick={() => handleRemoveExistingImage(path)}
                                />
                                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">X</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* New Image Upload */}
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />

                {/* New Image Preview */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        <p className="w-full text-sm text-gray-500">New Images to Upload:</p>
                        {images.map((file, index) => (
                            <div key={index} className="relative group">
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={`New ${index}`} 
                                    className="w-24 h-24 object-cover rounded border-2 border-blue-500"
                                />
                                <span 
                                    className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-full cursor-pointer"
                                    onClick={() => handleRemoveNewImage(index)}
                                >
                                    X
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 rounded text-white font-semibold transition duration-200 ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isLoading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
            </button>
        </form>
    );
};

export default ProjectForm;