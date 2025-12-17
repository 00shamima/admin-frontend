// src/components/AdminLayout.jsx

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    
    // Updated Navigation Items (using 'journey' instead of 'experience')
    const navItems = [
        { name: 'Dashboard', to: '/admin' },
        { name: 'Home Section', to: '/admin/home' },
        { name: 'About & Resume', to: '/admin/about' },
        { name: 'Skills', to: '/admin/skills' },
        { name: 'My Journey', to: '/admin/journey' }, // <-- Updated Path/Name
        { name: 'Projects', to: '/admin/projects' },
        { name: 'Contact Messages', to: '/admin/contacts' },
    ];

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed">
            <h1 className="text-2xl font-bold mb-8 text-indigo-400">Admin Panel</h1>
            <nav>
                {navItems.map(item => (
                    <Link key={item.name} to={item.to} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                        {item.name}
                    </Link>
                ))}
            </nav>
            <button
                onClick={logout}
                className="w-full mt-8 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    );
};

const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 w-full p-8">
                {/* Content Area for nested routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;