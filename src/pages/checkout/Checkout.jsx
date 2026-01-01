import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getCart } from "@/db/cardService";
import { placeOrder } from "@/db/orderService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { getFinalPrice } from "@/utils/price";

export default function Checkout() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getCart(user.id);
      setCart(data || []);
    }
    load();
  }, [user.id]);

  // ✅ TOTAL WITH DISCOUNT
  const total = cart.reduce((sum, item) => {
    const finalPrice = getFinalPrice(
      item.price,
      item.discountType,
      item.discountValue
    );
    return sum + finalPrice * item.qty;
  }, 0);



  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Checkout</h2>

        {/* ORDER SUMMARY */}
        <Card>
          <CardContent className="p-4 space-y-2">
            {cart.map((item) => {
              const finalPrice = getFinalPrice(
                item.price,
                item.discountType,
                item.discountValue
              );

              return (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>
                    ₹{finalPrice * item.qty}
                  </span>
                </div>
              );
            })}

            <hr />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </CardContent>
        </Card>

        {/* ADDRESS */}
        <Card>
          <CardContent className="p-4">
            <p className="font-medium">{user.name}</p>
            <p className="text-slate-500">
              Default Address (Demo)
            </p>
          </CardContent>
        </Card>

        {/* PAYMENT */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="font-medium">Payment Method</p>
            <p className="text-slate-500">
              Cash on Delivery
            </p>

            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await placeOrder(user.id);
                  refreshCart();
                  toast.success("🎉 Thank you for ordering!");
                  setTimeout(() => navigate("/"), 1200);
                } catch (err) {
                  toast.error(err.message || "Failed to place order");
                }
              }}
            >
              Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
