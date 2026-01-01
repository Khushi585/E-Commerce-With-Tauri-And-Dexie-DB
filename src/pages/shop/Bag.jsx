import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCart, updateQty, removeFromCart } from "@/db/cardService";
import { getFinalPrice } from "@/utils/price";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { placeOrder } from "@/db/orderService";
import { toast } from "react-toastify";


export default function Bag() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    async function loadCart() {
      setCart(await getCart(user.id));
    }
    loadCart();
  }, [user.id]);

  const total = cart.reduce(
    (sum, item) => {
      const final = getFinalPrice(
        item.price,
        item.discountType,
        item.discountValue
      );
      return sum + final * item.qty;
    },
    0
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/*  CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              My Bag 👜
            </h2>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <p className="text-lg">Your bag is empty</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/products")}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <CardContent className="p-6 flex gap-6 items-center">

                    {/* IMAGE */}
                    <img
                      src={item.thumbnail || "/placeholder.png"}
                      alt={item.name}
                      className="h-28 w-28 rounded-xl object-cover bg-white"
                    />

                    {/* INFO */}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-lg">
                        {item.name}
                      </h3>

                      <div className="text-sm text-slate-500">
                        {item.discountValue > 0 && (
                          <div className="text-xs text-green-600 font-semibold">
                            {item.discountType === "PERCENT"
                              ? `${item.discountValue}% OFF`
                              : `₹${item.discountValue} OFF`}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {item.discountValue > 0 ? (
                            <>
                              <span className="text-lg font-bold text-indigo-600">
                                ₹{getFinalPrice(item.price, item.discountType, item.discountValue)}
                              </span>
                              <span className="line-through text-sm text-gray-400">
                                ₹{item.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">₹{item.price}</span>
                          )}
                        </div>
                      </div>

                      {/* QTY CONTROLS */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border rounded-full overflow-hidden">
                          <Button
                            variant="ghost"
                            disabled={item.qty === 1}
                            onClick={async () => {
                              await updateQty(item.id, item.qty - 1);
                              setCart(await getCart(user.id));
                              refreshCart();
                            }}
                          >
                            −
                          </Button>

                          <span className="px-4 text-sm font-medium">
                            {item.qty}
                          </span>

                          <Button
                            variant="ghost"
                            disabled={item.qty >= (item.stock ?? 0)}
                            onClick={async () => {
                              try {
                                await updateQty(item.id, item.qty + 1);
                                setCart(await getCart(user.id));
                                refreshCart();
                              } catch (err) {
                                toast.error(err.message || "Stock limit reached");
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={async () => {
                            await removeFromCart(item.id);
                            setCart(await getCart(user.id));
                            refreshCart();
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="font-semibold text-lg">
                      ₹{getFinalPrice(item.price, item.discountType, item.discountValue) * item.qty}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/*  ORDER SUMMARY */}
          {cart.length > 0 && (
            <div className="sticky top-24 h-fit">
              <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-semibold">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span>{cart.length}</span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold text-slate-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                 <Button className="w-full" onClick={async () => {
                      try {
                      await placeOrder(user.id);
                      refreshCart(); 
                      toast.success("🎉 Thank you for your order!");
                      navigate("/"); 
                      } catch (err) {
                      toast.error(err.message);
                     }
                     }}>
                     Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
