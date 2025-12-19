import React from 'react';
// BrowserRouter-kku badhula HashRouter kandaipaaga irukkanum
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
              {/* ROOT PATH FIX: 
                Ippo unga site-ai open seidha udane direct-a Login page varum.
                "Hello World" text-ai naan remove seidhu vittaen.
              */}
              <Route path="/" element={<LoginPage />} /> 
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                {/* Admin dashboard-ukku pona udane automatic-a home page-ukku redirect aagum 
                */}
                <Route index element={<Navigate to="home" replace />} /> 
                
                <Route path="home" element={<AdminHome />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="journey" element={<AdminJourney />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="contacts" element={<AdminContacts />} />
              </Route>
              
              {/* 404 Route - Intha route-ai kandaipaaga HashRouter handle seiyum */}
              <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1>404 - Page Not Found</h1></div>} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;