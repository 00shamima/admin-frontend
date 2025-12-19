import React from 'react';
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
              {/* Root path-ai '#' kku apram handle seiyum */}
              <Route path="/" element={<LoginPage />} /> 
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="home" replace />} /> 
                <Route path="home" element={<AdminHome />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="journey" element={<AdminJourney />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="contacts" element={<AdminContacts />} />
              </Route>
              
              {/* Redirect any other path to root if it fails */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;