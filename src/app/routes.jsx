import { Routes, Route, Navigate } from "react-router-dom";

// auth
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// shop
import Products from "@/pages/shop/Products";
import Wishlist from "@/pages/shop/Wishlist";
import Bag from "../pages/shop/Bag";

// user
import Profile from "@/pages/user/Profile";

// context
import { useAuth } from "@/context/AuthContext";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/shop/ProductDetails";
import Checkout from "@/pages/checkout/Checkout";
import OrderSuccess from "@/pages/checkout/OrderSuccess";
import MyOrders from "@/pages/orders/MyOrders";
import AdminRoute from "@/admin/routes/AdminRoute";
import AdminLayout from "@/admin/components/AdminLayout";
import Dashboard from "@/admin/pages/Dashboard";
import AdminProducts from "@/admin/pages/Products";
import AdminOrders from "@/admin/pages/Orders";
import AdminUsers from "@/admin/pages/Users";

/* ---------------- Protected Route ---------------- */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/* ---------------- Routes ---------------- */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />


      {/* Protected (User Ecommerce) */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />


      <Route
        path="/bag"
        element={
          <ProtectedRoute>
            <Bag />
          </ProtectedRoute>
        }
      />

      <Route path="/my-orders" element={<MyOrders />} />

      <Route path="/products" element={<Products />} />
      <Route path="/products/edit/:orderId" element={<Products />} />


      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      
      {/* ADMIN ROUTE */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />

    </Routes>
  );
}
