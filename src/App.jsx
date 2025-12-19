import React from 'react';
// BrowserRouter-kku badhula HashRouter import pannunga
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; 
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
    // Router dhaan mela irukanum
    <Router>
      <AuthProvider>
          <Routes>
              {/* Public Route */}
              <Route path="/" element={<h1>Hello World!</h1>} /> 
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
              
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;