import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@example.com'); // Pre-fill for convenience
  const [password, setPassword] = useState('**********'); // Pre-fill for convenience
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW STATE for loading
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // Start loading

    try {
      const response = await apiService.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      login(token, user); 
      // Successful login automatically redirects via useAuth context
    } catch (err) {
      console.error("Login Error:", err);
      // Display detailed message from backend, or a generic one if the server is unreachable (e.g., net::ERR_CONNECTION_REFUSED)
      setError(
        err.response?.data?.message || 
        (err.code === 'ERR_NETWORK' ? 'Server is offline or unreachable.' : 'Login failed. Check credentials.')
      );
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Admin Login</h2>
        
        {/* Error Display */}
        {error && <p className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
            required
            disabled={isSubmitting} // Disable while loading
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
            required
            disabled={isSubmitting} // Disable while loading
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while loading
          className={`w-full py-2 rounded text-white font-semibold transition duration-200 
            ${isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isSubmitting ? 'Logging In...' : 'Login'} 
        </button>
      </form>
    </div>
  );
};

export default LoginPage;