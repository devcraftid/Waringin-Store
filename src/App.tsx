import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/customer/Profile';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import ShopDetail from './pages/customer/ShopDetail';
import CheckoutSuccess from './pages/customer/CheckoutSuccess';
import Checkout from './pages/customer/Checkout';

// Info Pages
import Help from './pages/info/Help';
import Payment from './pages/info/Payment';
import Shipping from './pages/info/Shipping';
import Returns from './pages/info/Returns';
import Warranty from './pages/info/Warranty';
import Contact from './pages/info/Contact';
import About from './pages/info/About';
import Careers from './pages/info/Careers';
import Privacy from './pages/info/Privacy';
import Terms from './pages/info/Terms';
import Blog from './pages/info/Blog';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import ShopManagement from './pages/admin/ShopManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Seller
import SellerDashboard from './pages/seller/SellerDashboard';
import ShopSetup from './pages/seller/ShopSetup';
import Overview from './pages/seller/Overview';
import ProductList from './pages/seller/ProductList';
import ProductForm from './pages/seller/ProductForm';
import Orders from './pages/seller/Orders';
import Finance from './pages/seller/Finance';
import Settings from './pages/seller/Settings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/shop/:slug" element={<ShopDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />

            {/* Info Pages */}
            <Route path="/help" element={<Help />} />
            <Route path="/help/payment" element={<Payment />} />
            <Route path="/help/shipping" element={<Shipping />} />
            <Route path="/help/returns" element={<Returns />} />
            <Route path="/help/warranty" element={<Warranty />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />

            {/* Customer / Common Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/notifications" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />

            {/* Seller Routes */}
            <Route 
              path="/seller/setup" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['seller', 'admin']}>
                    <ShopSetup />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/seller" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['seller', 'admin']}>
                    <SellerDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="finance" element={<Finance />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="shops" element={<ShopManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
