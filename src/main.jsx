// src/main.jsx (FINAL CORRECTED CODE)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; 


import { AuthProvider } from './context/AuthContext'; 
import AdminRoute from './Components/AdminRoute'; 
import LoginPage from './pages/LoginPage'; // <--- Check this line and path!
import AdminLayout from './Components/AdminLayout';

import AdminHome from './pages/AdminHome'; 
import AdminAbout from './pages/AdminAbout';
import AdminSkills from './pages/AdminSkills';
import AdminJourney from './pages/AdminJourney'; 
import AdminProjects from './pages/AdminProjects'; 
import AdminContacts from './pages/AdminContacts'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. **CRITICAL FIX B: BrowserRouter MUST BE OUTERMOST** */}
    {/* This ensures the AuthProvider's useAuth/useNavigate hook runs within the router context. */}
    <BrowserRouter> 
      <AuthProvider>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<h1>Public Portfolio Home</h1>} /> 
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            
            <Route index element={
                <div className="p-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Welcome Admin!</h1>
                </div>
            } /> 
            
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="journey" element={<AdminJourney />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
          
          {/* 404 Not Found Page */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);