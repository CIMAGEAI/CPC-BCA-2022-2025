import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ArrowUpRight,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminLayout from '../../components/layout/AdminLayout';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery(
    ['adminStats', timeRange],
    async () => {
      const response = await api.get(`/admin/dashboard?timeRange=${timeRange}`);
      return response.data.data;
    }
  );

  // Fetch recent orders
  const { data: recentOrders } = useQuery(
    'recentOrders',
    async () => {
      const response = await api.get('/admin/orders?limit=5');
      return response.data.data;
    }
  );

  // Fetch low stock products
  const { data: lowStockProducts } = useQuery(
    'lowStockProducts',
    async () => {
      const response = await api.get('/admin/products?lowStock=true&limit=5');
      return response.data.data;
    }
  );

  // Fetch pending payment verifications
  const { data: pendingPayments } = useQuery(
    'pendingPayments',
    async () => {
      const response = await api.get('/admin/payment-verification?status=pending_verification&limit=5');
      return response.data.data;
    }
  );

  // Fetch contact statistics
  const { data: contactStats } = useQuery(
    'contactStats',
    async () => {
      const response = await api.get('/contacts/admin/stats');
      return response.data.data;
    }
  );

  // Fetch recent contacts
  const { data: recentContacts } = useQuery(
    'recentContacts',
    async () => {
      const response = await api.get('/contacts/admin?limit=5');
      return response.data.data;
    }
  );

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue', href }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : change < 0 ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <span className="mr-1">—</span>
              )}
              <span>
                {change > 0 ? '+' : ''}{change}% from last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {href && (
        <Link 
          to={href}
          className="mt-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          View details
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      )}
    </motion.div>
  );

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      case 'refunded': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-4">
        {/* Header */}
        <div className="mb-8 w-full max-w-6xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6 w-full max-w-6xl flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${stats?.revenue?.toLocaleString() || '0'}`}
            change={stats?.revenueChange}
            icon={DollarSign}
            color="green"
            href="/admin/orders"
          />
          <StatCard
            title="Total Orders"
            value={stats?.orders?.toLocaleString() || '0'}
            change={stats?.ordersChange}
            icon={ShoppingCart}
            color="blue"
            href="/admin/orders"
          />
          <StatCard
            title="Total Products"
            value={stats?.products?.toLocaleString() || '0'}
            change={stats?.productsChange}
            icon={Package}
            color="purple"
            href="/admin/products"
          />
          <StatCard
            title="Total Customers"
            value={stats?.customers?.toLocaleString() || '0'}
            change={stats?.customersChange}
            icon={Users}
            color="orange"
            href="/admin/users"
          />
          <StatCard
            title="New Contacts"
            value={contactStats?.today || '0'}
            icon={MessageSquare}
            color="indigo"
            href="/admin/contacts"
          />
        </div>

        {/* Main Content: Recent Orders, Low Stock Products, Pending Payments & Recent Contacts */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Recent Orders</h2>
            <div className="p-6">
              {recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.user?.name || 'Guest'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Low Stock Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Low Stock Products</h2>
            <div className="p-6">
              {lowStockProducts?.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {product.mainImage ? (
                            <img 
                              src={product.mainImage.url} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">₹{product.price?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {product.stock} left
                        </p>
                        <Link
                          to={`/admin/products`}
                          className="text-sm text-orange-600 hover:text-orange-700"
                        >
                          Restock
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>All products are well stocked</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pending Payment Verifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Pending Payment Verifications</h2>
            <div className="p-6">
              {pendingPayments?.length > 0 ? (
                <div className="space-y-4">
                  {pendingPayments.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-yellow-100">
                          <CreditCard className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.user?.name || 'Guest'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 text-center">
                    <Link
                      to="/admin/payment-verification"
                      className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      View all pending payments
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending payment verifications</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Recent Contacts</h2>
            <div className="p-6">
              {recentContacts?.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(contact.status)}`}>
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</p>
                          <p className="text-sm text-gray-500">{contact.subjectDisplay}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                        <Link
                          to="/admin/contacts"
                          className="text-sm text-orange-600 hover:text-orange-700"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 text-center">
                    <Link
                      to="/admin/contacts"
                      className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      View all contacts
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent contacts</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-500">Create a new product listing</p>
              </div>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-500">View and update order status</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Users className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">User Management</p>
                <p className="text-sm text-gray-500">Manage customer accounts</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 