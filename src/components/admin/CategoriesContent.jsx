import React from 'react';
import { Plus, Edit3, Trash2, Tag } from 'lucide-react';

const CategoriesContent = ({ 
  categories, 
  loading, 
  error, 
  openModal, 
  handleDelete 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={() => openModal('category')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category._id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal('category', category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('category', category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No categories found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesContent;