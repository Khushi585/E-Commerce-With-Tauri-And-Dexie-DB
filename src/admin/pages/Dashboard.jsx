import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/db/db";
import { useEffect, useState } from "react";
import SalesPie from "@/admin/components/SalesPie";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  const [salesByCategory, setSalesByCategory] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function loadStats() {
      const [users, products, ordersCount] = await Promise.all([
        db.users.count(),
        db.products.count(),
        db.orders.count(),
      ]);

      setStats({ users, products, orders: ordersCount });

      // Compute sales by category and top products
      const orders = await db.orders.toArray();

      const categoryMap = new Map();
      const productMap = new Map();

      for (const order of orders) {
        const items = order.items || [];
        for (const it of items) {
          const revenue = (it.finalPrice || it.price || 0) * (it.qty || 0);

          // product-level aggregation
          const prevProd = productMap.get(it.productId) || { name: it.name, qty: 0, revenue: 0 };
          prevProd.qty += it.qty || 0;
          prevProd.revenue += revenue;
          productMap.set(it.productId, prevProd);

          // category aggregation (resolve product to category)
          const prod = await db.products.get(it.productId);
          const category = prod?.category || "Uncategorized";
          const prev = categoryMap.get(category) || 0;
          categoryMap.set(category, prev + revenue);
        }
      }

      // Convert maps to arrays
      const salesCat = Array.from(categoryMap.entries()).map(([label, value], i) => ({
        label,
        value,
        color: ["#60a5fa", "#34d399", "#f97316", "#f43f5e", "#a78bfa"][i % 5],
      }));

      const topProds = Array.from(productMap.entries())
        .map(([productId, val]) => ({ productId, ...val }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setSalesByCategory(salesCat);
      setTopProducts(topProds);
    }

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();              // 🔐 clear auth
    navigate("/login");    // 🔀 redirect
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">
            Total Users
          </p>
          <p className="text-2xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">
            Total Products
          </p>
          <p className="text-2xl font-bold">
            {stats.products}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>
          <p className="text-2xl font-bold">
            {stats.orders}
          </p>
        </div>
      </div>

      {/* SALES CHART / TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Sales by Category</h3>
          <div className="h-64 flex items-center">
            <SalesPie data={salesByCategory} />
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-slate-500">No products sold yet</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.productId} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-slate-500">Qty sold: {p.qty}</div>
                  </div>
                  <div className="font-semibold">₹{Number(p.revenue).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
