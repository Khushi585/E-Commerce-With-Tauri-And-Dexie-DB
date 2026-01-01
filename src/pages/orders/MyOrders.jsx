import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { db } from "@/db/db";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    async function loadOrders() {
      const data = await db.orders
        .where("userId")
        .equals(user.id)
        .reverse()
        .toArray();

      setOrders(data || []);
    }
    loadOrders();
  }, [user.id]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <h2 className="text-2xl font-semibold">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-slate-500">
            No orders placed yet
          </p>
        ) : (
          orders.map((order) => {
            const isOpen = expandedOrderId === order.id;

            return (
              <Card key={order.id} className="rounded-xl">
                <CardContent className="p-4 space-y-4">

                  {/* HEADER */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setExpandedOrderId(
                        isOpen ? null : order.id
                      )
                    }
                  >
                    <div>
                      <p className="font-semibold">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <button className="bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600" onClick={()=> navigate(`/products/edit/${order.id}`)}>Edit Order</button>
                      
                      <p className="font-semibold">
                        ₹{order.total}
                      </p>
                      <p className="text-sm text-green-600">
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS (EXPAND) */}
                  {isOpen && (
                    <div className="border-t pt-4 space-y-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-center"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="h-16 w-16 rounded object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              Qty: {item.qty}
                            </p>
                          </div>

                          <div className="font-medium">
                            ₹{item.price * item.qty}
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold pt-3">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
