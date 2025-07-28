import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const Modal = ({ 
  showModal, 
  modalType, 
  editingItem, 
  setEditingItem, 
  loading, 
  setLoading, 
  error,
  setError, 
  closeModal, 
  categories, 
  products, 
  setProducts, 
  setCategories,
  API_BASE_URL,
  authToken,
  brands
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    variants: [],
    mainImage: '',
    additionalImages: [],
    basePrice: 0,
    featured: false,
    tags: [],
    stock: 0,
    brand: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  const [brandFormData, setBrandFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  
  const [currentVariant, setCurrentVariant] = useState({
    images: [],
    dynamicFields: [{ key: '', value: '' }],
  });
  
  const [newImage, setNewImage] = useState('');
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  useEffect(() => {
    if (showModal) {
      setValidationErrors({});
      if (editingItem) {
        if (modalType === 'product') {
          setFormData({
            name: editingItem.name || '',
            description: editingItem.description || '',
            category: editingItem.category?._id || editingItem.category || '',
            variants: editingItem.variants || [],
            mainImage: editingItem.mainImage || '',
            additionalImages: editingItem.additionalImages || [],
            basePrice: editingItem.basePrice || 0,
            featured: editingItem.featured || false,
            tags: editingItem.tags || [],
            brand: editingItem.brand?._id || editingItem.brand || ''
          });
        } else if (modalType === 'category') {
          setCategoryFormData({
            name: editingItem.name || '',
            description: editingItem.description || '',
            image: editingItem.image || ''
          });
        } else if (modalType === 'brand') {
          setBrandFormData({
            name: editingItem.name || '',
            description: editingItem.description || '',
            category: editingItem.category?._id || editingItem.category || ''
          });
        }
      } else {
        if (modalType === 'product') {
          setFormData({
            name: '',
            description: '',
            category: '',
            variants: [],
            mainImage: '',
            additionalImages: [],
            basePrice: 0,
            featured: false,
            tags: [],
            brand: ''
          });
        } else if (modalType === 'category') {
          setCategoryFormData({
            name: '',
            description: '',
            image: ''
          });
        } else if (modalType === 'brand') {
          setBrandFormData({
            name: '',
            description: '',
            category: ''
          });
        }
      }
      setCurrentVariant({
        images: [],
        dynamicFields: [{ key: '', value: '' }],
      });
      setNewImage('');
      setShowVariantForm(false);
    }
  }, [showModal, modalType, editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
             type === 'number' ? parseFloat(value) || 0 : 
             value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrandChange = (e) => {
    const { name, value } = e.target;
    setBrandFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentVariant(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleAddVariantImage = () => {
    if (newImage.trim()) {
      setCurrentVariant(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveVariantImage = (index) => {
    setCurrentVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddDynamicField = () => {
    setCurrentVariant((prev) => ({
      ...prev,
      dynamicFields: [...prev.dynamicFields, { key: '', value: '' }],
    }));
  };

  const handleRemoveDynamicField = (index) => {
    setCurrentVariant(prev => {
      const updated = [...prev.dynamicFields];
      updated.splice(index, 1);
      return { ...prev, dynamicFields: updated };
    });
  };

  const handleDynamicFieldChange = (index, field, value) => {
    setCurrentVariant((prev) => {
      const updated = [...prev.dynamicFields];
      updated[index][field] = value;
      return { ...prev, dynamicFields: updated };
    });
  };

  const handleAddVariant = () => {
    const dynamicData = {};
    currentVariant.dynamicFields.forEach(({ key, value }) => {
      if (key) dynamicData[key] = value;
    });
    const variantToAdd = {
      images: currentVariant.images,
      ...dynamicData,
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, variantToAdd],
    }));
    setCurrentVariant({ images: [], dynamicFields: [{ key: '', value: '' }] });
  };

  const handleImageUpload = (e, isVariant = false, isMainImage = false) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (isMainImage) {
        setFormData(prev => ({
          ...prev,
          mainImage: imageUrl
        }));
      } else if (isVariant) {
        setCurrentVariant(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, imageUrl]
        }));
      }
    }
  };

  const handleVariantFieldChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (modalType === 'product') {
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.description) errors.description = 'Description is required';
      if (!formData.category) errors.category = 'Category is required';
      if (!formData.mainImage) errors.mainImage = 'Main image is required';
    } else if (modalType === 'category') {
      if (!categoryFormData.name) errors.name = 'Name is required';
      if (!categoryFormData.description) errors.description = 'Description is required';
    } else if (modalType === 'brand') {
      if (!brandFormData.name) errors.name = 'Name is required';
      if (!brandFormData.description) errors.description = 'Description is required';
      if (!brandFormData.category) errors.category = 'Category is required';
    }
    
    if (formData.variants && Array.isArray(formData.variants)) {
      for (const variant of formData.variants) {
        if (!variant.images || !Array.isArray(variant.images) || variant.images.length === 0) {
          errors.variants = 'Each variant must have at least one image';
          break;
        }
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showVariantForm) {
      setError('Please finish adding or editing the variant before saving the product.');
      return;
    }
    setError('');
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (modalType === 'product') {
        if (editingItem) {
          response = await axios.put(
            `${API_BASE_URL}/products/${editingItem._id}`,
            formData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setProducts(products.map(p => p._id === editingItem._id ? response.data : p));
        } else {
          response = await axios.post(
            `${API_BASE_URL}/products`,
            formData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setProducts([...products, response.data]);
        }
      } else if (modalType === 'category') {
        if (editingItem) {
          response = await axios.put(
            `${API_BASE_URL}/categories/${editingItem._id}`,
            categoryFormData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setCategories(categories.map(c => c._id === editingItem._id ? response.data : c));
        } else {
          response = await axios.post(
            `${API_BASE_URL}/categories`,
            categoryFormData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          setCategories([...categories, response.data]);
        }
      } else if (modalType === 'brand') {
        if (editingItem) {
          response = await axios.put(
            `${API_BASE_URL}/brands/${editingItem._id}`,
            brandFormData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
        } else {
          response = await axios.post(
            `${API_BASE_URL}/brands`,
            brandFormData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
        }
      }
      
      closeModal();
    } catch (err) {
      console.error('Error saving:', err);
      const errorMessage = err.response?.data?.message || `Failed to save ${modalType}`;
      setError(errorMessage);
      
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.path] = error.msg;
        });
        setValidationErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleEditVariant = (index) => {
    const variant = formData.variants[index];
    const dynamicFields = Object.entries(variant)
      .filter(([key]) => key !== 'images')
      .map(([key, value]) => ({ key, value }));
    setCurrentVariant({
      images: variant.images || [],
      dynamicFields: dynamicFields.length ? dynamicFields : [{ key: '', value: '' }],
    });
    setShowVariantForm(true);
    setEditingVariantIndex(index);
  };

  const handleAddOrUpdateVariant = () => {
    const dynamicData = {};
    currentVariant.dynamicFields.forEach(({ key, value }) => {
      if (key) dynamicData[key] = value;
    });
    const variantToSave = {
      images: currentVariant.images,
      price: currentVariant.price,
      stock: currentVariant.stock,
      ...dynamicData,
    };

    if (editingVariantIndex !== null) {
      setFormData((prev) => {
        const updated = [...prev.variants];
        updated[editingVariantIndex] = variantToSave;
        return { ...prev, variants: updated };
      });
      setEditingVariantIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, variantToSave],
      }));
    }
    setCurrentVariant({ images: [], dynamicFields: [{ key: '', value: '' }], price: '', stock: '' });
    setShowVariantForm(false);
  };

  const handleCancelVariantEdit = () => {
    setCurrentVariant({ images: [], dynamicFields: [{ key: '', value: '' }] });
    setShowVariantForm(false);
    setEditingVariantIndex(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {modalType === 'product' ? (
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold">
                {editingItem ? 'Edit Product' : 'Add Product'}
              </h1>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${validationErrors.category ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  rows="4"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Base Price</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Product Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || ''}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Main Image*</label>
                {validationErrors.mainImage && (
                  <p className="mb-2 text-sm text-red-600">{validationErrors.mainImage}</p>
                )}
                {formData.mainImage ? (
                  <div className="relative mb-4">
                    <img src={formData.mainImage} alt="Main product" className="h-32 w-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, mainImage: ''}))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="block bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                      <span className="text-gray-700">Upload main image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Additional Images</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image URL"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Add URL
                    </button>
                  </div>
                  
                  <div className="relative">
                    <label className="block bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                      <span className="text-gray-700">Upload from gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {formData.additionalImages.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.additionalImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Additional ${index + 1}`} className="h-12 w-12 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formData.additionalImages.length} image(s) added</p>
                  </div>
                )}
              </div>

              <div className="mb-8 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Variants (Optional)</h2>
                
                {formData.variants.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Added Variants:</h3>
                    <ul className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <li key={index} className="border p-3 rounded flex justify-between items-center">
                          <div>
                            {Object.entries(variant)
                              .filter(([key]) => key !== 'images')
                              .map(([key, value]) => (
                                <span key={key} className="mr-2 font-medium">{key}: {value}</span>
                              ))}
                            {variant.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {variant.images.map((img, imgIndex) => (
                                  <div key={imgIndex} className="relative">
                                    <img src={img} alt={`Variant ${index + 1}`} className="h-12 w-12 object-cover rounded" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditVariant(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">No variants added yet. Variants are optional.</p>
                  </div>
                )}
                
                {showVariantForm ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{editingVariantIndex !== null ? 'Edit Variant' : 'Add New Variant'}</h3>
                      <button
                        type="button"
                        onClick={handleCancelVariantEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Add any attribute (key-value) for this variant.</label>
                      {currentVariant.dynamicFields
                        .filter(field => field.key !== 'stock' && field.key !== 'price')
                        .map((field, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Key"
                            value={field.key}
                            onChange={e => handleDynamicFieldChange(idx, 'key', e.target.value)}
                            className="border rounded px-2 py-1"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={field.value}
                            onChange={e => handleDynamicFieldChange(idx, 'value', e.target.value)}
                            className="border rounded px-2 py-1"
                          />
                          <button type="button" onClick={() => handleRemoveDynamicField(idx)} className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddDynamicField}
                        className="text-blue-500 hover:underline"
                      >
                        + Add Field
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Images*</label>
                      {validationErrors.variantImages && (
                        <p className="mb-2 text-sm text-red-600">{validationErrors.variantImages}</p>
                      )}
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter image URL"
                          />
                          <button
                            type="button"
                            onClick={handleAddVariantImage}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                          >
                            Add URL
                          </button>
                        </div>
                        <div className="relative">
                          <label className="block bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                            <span className="text-gray-700">Upload from gallery</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      {currentVariant.images.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {currentVariant.images.map((img, index) => (
                              <div key={index} className="relative">
                                <img src={img} alt={`Variant ${index + 1}`} className="h-12 w-12 object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{currentVariant.images.length} image(s) added</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Price*</label>
                        <input
                          type="number"
                          name="price"
                          value={currentVariant.price || ''}
                          onChange={e => setCurrentVariant(prev => ({ ...prev, price: e.target.value }))}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Stock*</label>
                        <input
                          type="number"
                          name="stock"
                          value={currentVariant.stock || ''}
                          onChange={e => setCurrentVariant(prev => ({ ...prev, stock: e.target.value }))}
                          min="0"
                          step="1"
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleCancelVariantEdit}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddOrUpdateVariant}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {editingVariantIndex !== null ? 'Update Variant' : 'Add Variant'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVariantForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Variant</span>
                  </button>
                )}
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700">Featured</label>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                  disabled={loading || showVariantForm}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : modalType === 'category' ? (
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} Category
              </h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name*</label>
                <input
                  type="text"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter category name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <textarea
                  name="description"
                  value={categoryFormData.description}
                  onChange={handleCategoryChange}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${validationErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Category description"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={categoryFormData.image}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            
              <div className="flex justify-end space-x-4 mt-6 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : modalType === 'brand' ? (
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} Brand
              </h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name*</label>
                <input
                  type="text"
                  name="name"
                  value={brandFormData.name}
                  onChange={handleBrandChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter brand name"
                  required
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <textarea
                  name="description"
                  value={brandFormData.description}
                  onChange={handleBrandChange}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${validationErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Brand description"
                  required
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                <select
                  name="category"
                  value={brandFormData.category}
                  onChange={handleBrandChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${validationErrors.category ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>
            
              <div className="flex justify-end space-x-4 mt-6 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;