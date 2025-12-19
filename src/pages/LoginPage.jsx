import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@x.com'); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Backend request
      const response = await apiService.post('/auth/login', { 
        email: email.toLowerCase(), 
        password 
      });

      const { token, user } = response.data;
      login(token, user); 
      
    } catch (err) {
      console.error("Login Error:", err);
      // Backend error message-ai display seiyum
      setError(err.response?.data?.message || "Server error during login.");
    } finally {
      // Button-ai thirumba enable seiyum
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Admin Login</h2>
        
        {error && <p className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white font-semibold transition 
            ${isSubmitting ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isSubmitting ? 'Logging In...' : 'Login'} 
        </button>
      </form>
    </div>
  );
};

export default LoginPage;