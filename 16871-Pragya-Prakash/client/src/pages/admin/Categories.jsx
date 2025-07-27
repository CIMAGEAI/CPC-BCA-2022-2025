import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Folder, XCircle } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', parent: '', description: '' });
  const [error, setError] = useState('');

  // Fetch categories
  const { data: categories, isLoading } = useQuery(['adminCategories', search], async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const res = await api.get(`/admin/categories?${params}`);
    return res.data.data;
  });

  // Create or update category
  const saveMutation = useMutation(
    async (data) => {
      if (editCategory) {
        return api.put(`/admin/categories/${editCategory._id}`, data);
      } else {
        return api.post('/admin/categories', data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCategories');
        setShowForm(false);
        setEditCategory(null);
        setForm({ name: '', parent: '', description: '' });
      },
      onError: (err) => setError(err.response?.data?.message || 'Error saving category')
    }
  );

  // Delete category
  const deleteMutation = useMutation(
    async (id) => api.delete(`/admin/categories/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries('adminCategories')
    }
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Name is required');
      return;
    }
    saveMutation.mutate(form);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setForm({
      name: category.name,
      parent: category.parent,
      description: category.description
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
              <button
                onClick={() => { setShowForm(true); setEditCategory(null); setForm({ name: '', parent: '', description: '' }); }}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="h-5 w-5" />
                <span>Add Category</span>
              </button>
            </div>
            <div className="mb-6 flex items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                  ) : categories?.length ? (
                    categories.map(category => (
                      <tr key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{category.parent?.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                          <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => deleteMutation.mutate(category._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center py-8">No categories found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Category Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
                  {error && <div className="mb-4 text-red-600">{error}</div>}
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    <input type="text" placeholder="Parent Category" value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                    <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => { setShowForm(false); setEditCategory(null); setError(''); }} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">{editCategory ? 'Update' : 'Create'}</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories; 