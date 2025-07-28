import React, { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import DashboardContent from '../components/admin/DashboardContent';
import ProductsContent from '../components/admin/ProductsContent';
import CategoriesContent from '../components/admin/CategoriesContent';
import Modal from '../components/admin/Modal';
import BrandsContent from './admin/BrandsContent'; // Import at the top

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api';
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const formattedProducts = response.data.map(product => ({
        ...product,
        category: product.category?.name || 'Uncategorized',
        price: product.price || 0,
        countInStock: product.variants?.reduce((sum, variant) => sum + (variant.countInStock || 0), 0) || 0
      }));
      
      setProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/brands`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setBrands(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    } else {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }
  }, [authToken, navigate]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleDelete = async (type, id) => {
    try {
      setLoading(true);

      if (type === 'product') {
        await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setProducts(products.filter(p => p._id !== id));
      } else if (type === 'category') {
        await axios.delete(`${API_BASE_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setCategories(categories.filter(c => c._id !== id));
      } else if (type === 'brand') {
        await axios.delete(`${API_BASE_URL}/brands/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setBrands(brands.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTotalStock = (product) => parseInt(product.stock) || 0;

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent products={products} categories={categories} brands={brands} loading={loading} error={error} />;
      case 'products':
        return <ProductsContent 
          filteredProducts={filteredProducts}
          loading={loading} 
          error={error} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          openModal={openModal} 
          handleDelete={handleDelete} 
        />;
      case 'categories':
        return <CategoriesContent 
          categories={categories}
          loading={loading}
          error={error}
          openModal={openModal}
          handleDelete={handleDelete}
        />;
      case 'brands':
        return <BrandsContent
          brands={brands}
          loading={loading}
          error={error}
          handleDelete={handleDelete}
          categories={categories}
          setBrands={setBrands}
          API_BASE_URL={API_BASE_URL}
          authToken={authToken}
        />;
      default:
        return <DashboardContent products={products} categories={categories} brands={brands} loading={loading} error={error} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleLogout={handleLogout} 
      />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
                <p className="text-gray-600">Welcome back, Admin!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      <Modal 
        showModal={showModal}
        modalType={modalType}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        closeModal={closeModal}
        categories={categories}
        products={products}
        setProducts={setProducts}
        setCategories={setCategories}
        brands={brands}
        API_BASE_URL={API_BASE_URL}
        authToken={authToken}
      />
    </div>
  );
};

export default Dashboard;