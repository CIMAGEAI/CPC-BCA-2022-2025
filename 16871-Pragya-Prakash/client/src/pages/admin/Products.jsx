import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  X, 
  Filter,
  MoreVertical,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    sort: '-createdAt'
  });
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    stock: '',
    category: '',
    subcategory: '',
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isOnSale: false,
    salePercentage: '',
    tags: '',
    ingredients: '',
    allergens: [],
    dietaryInfo: [],
    origin: {
      region: '',
      state: '',
      country: 'India'
    },
    weight: {
      value: '',
      unit: 'g'
    },
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm'
    },
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: '',
      servingSize: ''
    },
    storageInstructions: '',
    cookingInstructions: '',
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    images: [] // for file objects
  });

  // Add error state
  const [formErrors, setFormErrors] = useState({});

  // Add image upload field and validation
  const [imageUploadError, setImageUploadError] = useState('');

  // Add loader state
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories for form
  const { data: categories } = useQuery('categories', async () => {
    const response = await api.get('/categories');
    return response.data.data;
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery(
    ['adminProducts', search, filters, page, limit],
    async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort: filters.sort
      });
      
      if (search) params.append('search', search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      
      const response = await api.get(`/admin/products?${params}`);
      return response.data;
    }
  );

  // Create or update product
  const saveMutation = useMutation(
    async (data) => {
      if (editProduct) {
        return api.put(`/admin/products/${editProduct._id}`, data);
      } else {
        return api.post('/admin/products', data);
      }
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('adminProducts');
        setShowForm(false);
        setEditProduct(null);
        resetForm();
        toast.success(editProduct ? 'Product updated successfully!' : 'Product created successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error saving product');
      }
    }
  );

  // Delete product
  const deleteMutation = useMutation(
    async (id) => api.delete(`/admin/products/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminProducts');
        toast.success('Product deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  );

  // Bulk update products
  const bulkUpdateMutation = useMutation(
    async ({ productIds, updates }) => api.put('/admin/products/bulk', { productIds, updates }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminProducts');
        setSelectedProducts([]);
        toast.success('Products updated successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error updating products');
      }
    }
  );

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      costPrice: '',
      stock: '',
      category: '',
      subcategory: '',
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      isOnSale: false,
      salePercentage: '',
      tags: '',
      ingredients: '',
      allergens: [],
      dietaryInfo: [],
      origin: {
        region: '',
        state: '',
        country: 'India'
      },
      weight: {
        value: '',
        unit: 'g'
      },
      dimensions: {
        length: '',
        width: '',
        height: '',
        unit: 'cm'
      },
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: '',
        servingSize: ''
      },
      storageInstructions: '',
      cookingInstructions: '',
      seo: {
        title: '',
        description: '',
        keywords: ''
      },
      images: []
    });
    setImageUploadError('');
  };

  const validateForm = (form) => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) errors.stock = 'Stock must be 0 or more';
    if (!form.category) errors.category = 'Category is required';
    if (form.images.length === 0) errors.images = 'At least one image is required';
    return errors;
  };

  const handleInputChange = (field, value) => {
    setForm(f => {
      const updated = { ...f, [field]: value };
      setFormErrors(validateForm(updated));
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(f => ({ ...f, images: [...f.images, ...files] }));
    setImageUploadError('');
  };

  const removeImage = (index) => {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
  };

  // Cloudinary upload function
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  };

  const uploadImageToBackend = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/products/upload`, {
      method: 'POST',
      body: data,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsUploading(true);
    try {
      // Upload all images
      const uploadedImages = [];
      for (let i = 0; i < form.images.length; i++) {
        const file = form.images[i];
        if (file instanceof File) {
          const uploadRes = await uploadImageToBackend(file);
          if (uploadRes.success) {
            uploadedImages.push({
              url: uploadRes.url,
              public_id: uploadRes.public_id,
              isMain: i === 0 // First image is main image
            });
          }
        } else {
          // If it's already an uploaded image (during edit)
          uploadedImages.push(file);
        }
      }

      if (uploadedImages.length === 0) {
        setImageUploadError('Image upload failed. Please try again.');
        setIsUploading(false);
        return;
      }

      // Prepare form data
      const formData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        images: uploadedImages,
      };
      
      if (form.subcategory) formData.subcategory = form.subcategory;
      if (form.comparePrice) formData.comparePrice = parseFloat(form.comparePrice);
      if (form.costPrice) formData.costPrice = parseFloat(form.costPrice);
      if (form.tags) formData.tags = form.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (form.ingredients) formData.ingredients = form.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing);
      if (form.allergens.length > 0) formData.allergens = form.allergens;
      if (form.dietaryInfo.length > 0) formData.dietaryInfo = form.dietaryInfo;
      if (form.origin.region || form.origin.state) formData.origin = form.origin;
      if (form.weight.value) formData.weight = form.weight;
      if (form.dimensions.length || form.dimensions.width || form.dimensions.height) formData.dimensions = form.dimensions;
      if (form.nutritionalInfo.calories || form.nutritionalInfo.protein) formData.nutritionalInfo = form.nutritionalInfo;
      if (form.storageInstructions) formData.storageInstructions = form.storageInstructions;
      if (form.cookingInstructions) formData.cookingInstructions = form.cookingInstructions;
      if (form.seo.title || form.seo.description) formData.seo = form.seo;
      
      // Boolean fields
      formData.isActive = form.isActive;
      formData.isFeatured = form.isFeatured;
      formData.isBestSeller = form.isBestSeller;
      formData.isNewArrival = form.isNewArrival;
      formData.isOnSale = form.isOnSale;
      
      if (form.isOnSale && form.salePercentage) {
        formData.salePercentage = parseFloat(form.salePercentage);
      }

      await saveMutation.mutateAsync(formData);
    } catch (err) {
      setImageUploadError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      comparePrice: product.comparePrice?.toString() || '',
      costPrice: product.costPrice?.toString() || '',
      stock: product.stock?.toString() || '',
      category: product.category?._id || '',
      subcategory: product.subcategory?._id || '',
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      isBestSeller: product.isBestSeller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isOnSale: product.isOnSale ?? false,
      salePercentage: product.salePercentage?.toString() || '',
      tags: product.tags?.join(', ') || '',
      ingredients: product.ingredients?.join(', ') || '',
      allergens: product.allergens || [],
      dietaryInfo: product.dietaryInfo || [],
      origin: product.origin || { region: '', state: '', country: 'India' },
      weight: product.weight || { value: '', unit: 'g' },
      dimensions: product.dimensions || { length: '', width: '', height: '', unit: 'cm' },
      nutritionalInfo: product.nutritionalInfo || {
        calories: '', protein: '', carbohydrates: '', fat: '', fiber: '', sugar: '', sodium: '', servingSize: ''
      },
      storageInstructions: product.storageInstructions || '',
      cookingInstructions: product.cookingInstructions || '',
      seo: product.seo || { title: '', description: '', keywords: '' },
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    let updates = {};
    switch (action) {
      case 'activate':
        updates = { isActive: true };
        break;
      case 'deactivate':
        updates = { isActive: false };
        break;
      case 'feature':
        updates = { isFeatured: true };
        break;
      case 'unfeature':
        updates = { isFeatured: false };
        break;
      default:
        return;
    }

    bulkUpdateMutation.mutate({
      productIds: selectedProducts,
      updates
    });
  };

  const getStatusBadge = (product) => {
    if (!product.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </span>;
    }
    
    const badges = [];
    if (product.isFeatured) {
      badges.push(
        <span key="featured" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-1">
          <Star className="h-3 w-3 mr-1" />
          Featured
        </span>
      );
    }
    if (product.isOnSale) {
      badges.push(
        <span key="sale" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-1">
          <TrendingDown className="h-3 w-3 mr-1" />
          On Sale
        </span>
      );
    }
    if (product.stock <= 10) {
      badges.push(
        <span key="low-stock" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Low Stock
        </span>
      );
    }
    
    return badges.length > 0 ? badges : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </span>
    );
  };

  useEffect(() => {
    if (showForm) {
      setFormErrors(validateForm(form));
    }
    // eslint-disable-next-line
  }, [showForm]);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditProduct(null); resetForm(); }}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Deactivate
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="featured">Featured</option>
                  <option value="onSale">On Sale</option>
                </select>
                
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories?.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                  <option value="price">Price Low-High</option>
                  <option value="-price">Price High-Low</option>
                  <option value="-stock">Stock High-Low</option>
                  <option value="stock">Stock Low-High</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === productsData?.data?.length && productsData?.data?.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(productsData?.data?.map(p => p._id) || []);
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                  </td>
                </tr>
              ) : productsData?.data?.length > 0 ? (
                productsData.data.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product._id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images[0].url}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{product.price?.toLocaleString()}</div>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{product.comparePrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        product.stock <= 10 ? 'text-red-600' : 
                        product.stock <= 50 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              deleteMutation.mutate(product._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products found</p>
                    <button
                      onClick={() => { setShowForm(true); setEditProduct(null); resetForm(); }}
                      className="mt-2 text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Add your first product
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {productsData?.pagination && productsData.pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === productsData.pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(page - 1) * limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, productsData.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{productsData.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, productsData.pagination.pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNum
                              ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === productsData.pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setEditProduct(null); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        {formErrors.name && <div className="text-red-600 text-sm mt-1">{formErrors.name}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={form.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Images *
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={handleImageChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">You can select multiple images. The first image will be the main image.</p>
                        
                        {/* Display selected images */}
                        {form.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {form.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image instanceof File ? URL.createObjectURL(image) : image.url}
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {formErrors.images && <div className="text-red-600 text-sm mt-1">{formErrors.images}</div>}
                        {imageUploadError && <div className="text-red-600 text-sm mt-1">{imageUploadError}</div>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          value={form.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        {formErrors.description && <div className="text-red-600 text-sm mt-1">{formErrors.description}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        {formErrors.price && <div className="text-red-600 text-sm mt-1">{formErrors.price}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compare Price (₹)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.comparePrice}
                          onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Price (₹)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.costPrice}
                          onChange={(e) => handleInputChange('costPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          value={form.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        {formErrors.stock && <div className="text-red-600 text-sm mt-1">{formErrors.stock}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories?.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.category && <div className="text-red-600 text-sm mt-1">{formErrors.category}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Product Status */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.isFeatured}
                          onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.isBestSeller}
                          onChange={(e) => handleInputChange('isBestSeller', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Best Seller</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.isNewArrival}
                          onChange={(e) => handleInputChange('isNewArrival', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditProduct(null); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || saveMutation.isLoading || Object.keys(formErrors).length > 0}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(isUploading || saveMutation.isLoading) ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts; 