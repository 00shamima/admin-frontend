import React from 'react';
// HashRouter kandaipaaga irukkanum GitHub Pages-ukku
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext'; 
import AdminRoute from './Components/AdminRoute'; 
import LoginPage from './pages/LoginPage';
import AdminLayout from './Components/AdminLayout';
import AdminHome from './pages/AdminHome';
import AdminAbout from './pages/AdminAbout';
import AdminSkills from './pages/AdminSkills';
import AdminJourney from './pages/AdminJourney';
import AdminProjects from './pages/AdminProjects';
import AdminContacts from './pages/AdminContacts';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
              {/* Login Routes - Slash illamalum irukka koodum */}
              <Route path="/" element={<LoginPage />} /> 
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Protected Routes - path="/admin/*" nu kudutha thaan nested routes work aagum */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                {/* Admin dashboard pona udane home-ku redirect aagum */}
                <Route index element={<Navigate to="home" replace />} /> 
                
                <Route path="home" element={<AdminHome />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="journey" element={<AdminJourney />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="contacts" element={<AdminContacts />} />
              </Route>
              
              {/* Wildcard Route - Ethuvum match aagala na ithu thaan kaatum */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                  <p className="text-lg text-gray-700">Page Not Found</p>
                  <button 
                    onClick={() => window.location.href = '#/'}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Go to Login
                  </button>
                </div>
              } />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;