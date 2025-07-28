import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import Modal from './Modal';

const BrandsContent = ({
  brands,
  loading,
  error,
  handleDelete,
  categories,
  setBrands,
  API_BASE_URL,
  authToken,
  refreshBrands 
}) => {
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const openBrandModal = (brand = null) => {
    setEditingBrand(brand);
    setShowBrandModal(true);
  };

  const closeBrandModal = () => {
    setEditingBrand(null);
    setShowBrandModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brands</h2>
          <p className="text-gray-600">Manage product brands</p>
        </div>
        <button
          onClick={() => openBrandModal()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Brand</span>
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
            {brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand._id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500">{brand.description}</p>
                    <p className="text-xs text-gray-400">Category: {brand.category?.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openBrandModal(brand)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('brand', brand._id)}
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
                No brands found
              </div>
            )}
          </div>
        )}
      </div>
      {/* Brand Modal */}
      {showBrandModal && (
        <Modal
          showModal={showBrandModal}
          modalType="brand"
          editingItem={editingBrand}
          setEditingItem={setEditingBrand}
          loading={loading}
          setLoading={() => {}} 
          error={error}
          setError={() => {}} 
          closeModal={closeBrandModal}
          categories={categories}
          setBrands={setBrands}
          API_BASE_URL={API_BASE_URL}
          authToken={authToken}
          refreshBrands={refreshBrands} 
        />
      )}
    </div>
  );
};

export default BrandsContent;