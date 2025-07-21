import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { Edit, Search, User, Shield, XCircle } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [role, setRole] = useState('customer');

  // Fetch users
  const { data: users, isLoading } = useQuery(['adminUsers', search], async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const res = await api.get(`/admin/users?${params}`);
    return res.data.data;
  });

  // Update user role
  const updateRoleMutation = useMutation(
    async ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUsers');
        setEditUser(null);
        setRole('customer');
      }
    }
  );

  const handleEdit = (user) => {
    setEditUser(user);
    setRole(user.role);
  };

  const handleRoleUpdate = (e) => {
    e.preventDefault();
    updateRoleMutation.mutate({ id: editUser._id, role });
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            </div>
            <div className="mb-6 flex items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                  ) : users?.length ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                          <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center py-8">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Edit Role Modal */}
            {editUser && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Update User Role</h2>
                  <form onSubmit={handleRoleUpdate} className="space-y-4">
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">Update</button>
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

export default AdminUsers; 