import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AdminAbout = () => {
    const [formData, setFormData] = useState({
        content: '',
        frontendFocus: '',
        performance: '',
        resumePath: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await apiService.get('/about');
                if (response.data) {
                    setFormData({
                        content: response.data.content || '',
                        frontendFocus: response.data.frontendFocus || '',
                        performance: response.data.performance || '',
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
        setResumeFile(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const data = new FormData();
        data.append('content', formData.content);
        data.append('frontendFocus', formData.frontendFocus);
        data.append('performance', formData.performance);

        if (resumeFile) {
            data.append('resume', resumeFile); 
        }
        
        try {
            await apiService.post('/about', data); 
            setMessage('All sections updated successfully!');
            // Re-fetch to sync
            const response = await apiService.get('/about');
            setFormData(prev => ({ ...prev, ...response.data }));
            setResumeFile(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Admin...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">About Page Management</h2>
            
            {message && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Core About */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Who I Am (General Content)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Core description..."
                    />
                </div>

                {/* Section 2: Frontend Focus */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Frontend Focus (React & UI/UX)</label>
                    <textarea
                        name="frontendFocus"
                        value={formData.frontendFocus}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mention your frontend expertise..."
                    />
                </div>

                {/* Section 3: Performance */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Performance & Speed Philosophy</label>
                    <textarea
                        name="performance"
                        value={formData.performance}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your take on clean code and speed..."
                    />
                </div>
                
                {/* Resume Upload Section */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Resume File</label>
                    <input type="file" onChange={handleFileChange} accept=".pdf,.docx" className="text-sm" />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Save All Changes'}
                </button>
            </form>
        </div>
    );
};

export default AdminAbout;