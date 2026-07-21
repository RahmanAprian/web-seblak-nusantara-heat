import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminIngredients from './pages/admin/AdminIngredients';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Publik - bisa dilihat tanpa login */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/daftar" element={<Register />} />

        {/* Wajib login - pelanggan */}
        <Route
          path="/pesan"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-pesanan"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pesanan/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Wajib login - admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pesanan"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/produk"
          element={
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bahan-baku"
          element={
            <ProtectedRoute adminOnly>
              <AdminIngredients />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Landing />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
