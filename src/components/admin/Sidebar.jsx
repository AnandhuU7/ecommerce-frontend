import React from 'react';
import { TrendingUp, Package, Grid3X3, LogOut, X, Tag } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, handleLogout }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeSection === 'dashboard' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveSection('products')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeSection === 'products' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </button>
          
          <button
            onClick={() => setActiveSection('categories')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeSection === 'categories' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Grid3X3 className="w-5 h-5 mr-3" />
            Categories
          </button>

          <button
            onClick={() => setActiveSection('brands')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeSection === 'brands' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Tag className="w-5 h-5 mr-3" />
            Brands
          </button>
        </div>
        
        <div className="mt-auto pt-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;