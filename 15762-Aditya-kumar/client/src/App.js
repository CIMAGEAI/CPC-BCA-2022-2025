import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import LenderDashboard from './pages/LenderDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotFlow from './pages/ForgetFlow';
import PackagesCategories from './pages/PackagesCategories';
import AppliancesCategories from './pages/AppliancesCategories'
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchedResults';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FurnitureCategories from './pages/FurnituresCategories';
import ElectronicsCategories from './pages/ElectronicsCategories'
import BikesCategories from './pages/BikeCategories'
import KidsBabyCategories from './pages/Kids-BabyCategories'
import MedicalCategories from './pages/MedicalCategories';
import FitnessCategories from './pages/FitnessCategories';
import Checkout from './pages/Checkout.jsx'
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotFlow />} />
        <Route path="/checkout/:productId" element={<Checkout />} />/

        <Route path="/categories/packages" element={<PackagesCategories />} />
        <Route path="/categories/furniture" element={<FurnitureCategories />} />
        <Route path="/categories/appliances" element={<AppliancesCategories />} />
        <Route path="/categories/electronics" element={<ElectronicsCategories />} />
        <Route path="/categories/bikes" element={<BikesCategories />} />
        <Route path="/categories/baby-kids" element={<KidsBabyCategories />} />

        <Route path="/categories/medical" element={<MedicalCategories />} />
        <Route path="/categories/fitness" element={<FitnessCategories />} />

        {/* <Route path="/packages/:category" element={<PackageCategory />} /> */}
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/lender"
          element={
            <ProtectedRoute role="lender">
              <LenderDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path='/*' element={
          <>
            <Navbar />
            <NotFound />
            <Footer />
          </>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
