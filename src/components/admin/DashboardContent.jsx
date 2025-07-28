import React from 'react';
import { ShoppingBag, Tag, BarChart2, TrendingUp } from 'lucide-react';

const DashboardContent = ({ products, categories, loading, error }) => {
  const getTotalStock = (product) => parseInt(product.stock) || 0;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: ShoppingBag,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Categories',
      value: categories.length,
      icon: Tag,
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Out of Stock',
      value: products.filter(p => getTotalStock(p) <= 0).length,
      icon: BarChart2,
      change: '-2%',
      trend: 'down',
    },
    {
      title: 'Featured Products',
      value: products.filter(p => p.featured).length,
      icon: TrendingUp,
      change: '+8%',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{loading ? '...' : stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className={`mt-4 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span>{stat.change}</span> from last month
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : products.slice(0, 5).map(product => (
              <div key={product._id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">${product.price?.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    getTotalStock(product) > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {
                      getTotalStock(product) > 0
                        ? 'In Stock'
                        : 'Out of Stock'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : categories.slice(0, 5).map(category => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {products.filter(p => p.category === category._id).length} products
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;