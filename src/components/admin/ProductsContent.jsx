import React from 'react';
import { Plus, Edit3, Trash2, Search, Star } from 'lucide-react';

const ProductsContent = ({ 
  filteredProducts, 
  loading, 
  error, 
  searchTerm, 
  setSearchTerm, 
  openModal, 
  handleDelete 
}) => {
  const getTotalStock = (product) => parseInt(product.stock) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => openModal('product')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Product</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Rating</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Featured</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">${product.price?.toFixed(2) || '0.00'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-600">{product.rating || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          {getTotalStock(product)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('product', product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('product', product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsContent;