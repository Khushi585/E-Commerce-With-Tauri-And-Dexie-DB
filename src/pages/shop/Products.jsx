import { useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFinalPrice } from "@/utils/price";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/db/cardService";
import { getProductsForUser } from "@/db/productService";
import {
  getOrderById,
  updateOrder,
} from "@/db/orderService";
import { toast } from "react-toastify";

export default function Products() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  /* ================= ROUTE ================= */
  const { orderId } = useParams();
  const isEditMode = Boolean(orderId);

  /* ================= QUERY ================= */
  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL || ""
  );
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  if (!user) return <Navigate to="/login" replace />;

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      let data = await getProductsForUser(user);

      if (selectedCategory) {
        data = data.filter(
          (p) =>
            p.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );
      }

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, [user, selectedCategory]);

  /* ================= LOAD ORDER (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEditMode || products.length === 0) return;

    async function loadOrder() {
      setLoading(true);
      const orderData = await getOrderById(Number(orderId));

      if (!orderData) {
        toast.error("Order not found");
        setLoading(false);
        return;
      }

      setOrder(orderData);

      setCart(
  (orderData.items || []).map((item) => {
    const prod = products.find(
      (p) => p.id === item.productId
    );

    return {
      ...item,
      thumbnail:
        prod?.thumbnail || prod?.images?.[0] || "",
    };
  })
);


      setLoading(false);
    }

    loadOrder();
  }, [orderId, products]);

  /* ================= CART HELPERS ================= */
  const getItemFromCart = (productId) =>
    cart.find((i) => i.productId === productId);

  const addProductEditMode = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          thumbnail:
            product.thumbnail || product.images?.[0],
          qty: 1,
        },
      ];
    });
  };

  const removeProductEditMode = (productId) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  /* ================= NORMAL MODE ================= */
  const handleAddToBag = async (product, e) => {
    e.stopPropagation();
    try {
      await addToCart(user.id, product);
      refreshCart();
      toast.success("Added to bag 🛍️");
    } catch {
      toast.error("Failed to add");
    }
  };

  /* ================= UPDATE ORDER ================= */
 const handleUpdateOrder = async () => {
  try {
    await updateOrder(Number(orderId), cart);
    toast.success("Order updated successfully");
    navigate(-1);
  } catch (err) {
    toast.error(err.message || "Update failed");
  }
};


  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div
        className={`mx-auto px-6 py-8 ${
          isEditMode
            ? "grid grid-cols-12 gap-6 max-w-full"
            : "max-w-7xl"
        }`}
      >
        {/* ================= LEFT : PRODUCTS ================= */}
        <div className={isEditMode ? "col-span-8" : ""}>
          {loading ? (
            <p className="text-center text-slate-500">
              Loading...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => {
                const finalPrice = getFinalPrice(
                  p.price,
                  p.discountType,
                  p.discountValue
                );
                const cartItem = getItemFromCart(p.id);

                return (
                  <Card
                    key={p.id}
                    className="hover:shadow-xl transition rounded-xl"
                    onClick={() => {
                      if (!isEditMode)
                        navigate(`/products/${p.id}`);
                    }}
                  >
                    <CardContent className="p-4 space-y-3">
                      <img
                        src={p.thumbnail || p.images?.[0]}
                        alt={p.name}
                        className="h-40 w-full object-cover rounded"
                      />

                      <h3 className="font-semibold text-sm">
                        {p.name}
                      </h3>

                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          ₹{finalPrice}
                        </span>

                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            isEditMode
                              ? addProductEditMode(p)
                              : handleAddToBag(p, e);
                          }}
                        >
                          Add
                        </Button>
                      </div>

                      {isEditMode && cartItem && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProductEditMode(p.id);
                            }}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            −
                          </button>
                          <span className="font-semibold">
                            {cartItem.qty}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addProductEditMode(p);
                            }}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RIGHT : ORDER PANEL ================= */}
        {isEditMode && (
          <div className="col-span-4 bg-white rounded-xl shadow-lg p-4 sticky top-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">
              Edit Order #{orderId}
            </h3>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500">
                No products added
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center gap-3 border-b pb-3 mb-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            removeProductEditMode(
                              item.productId
                            )
                          }
                          className="px-2 bg-gray-200 rounded"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() =>
                            addProductEditMode({
                              id: item.productId,
                              name: item.name,
                              price: item.price,
                              thumbnail: item.thumbnail,
                            })
                          }
                          className="px-2 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))
            )}

            <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>
                ₹
                {cart.reduce(
                  (sum, i) => sum + i.price * i.qty,
                  0
                )}
              </span>
            </div>

            <Button
              className="w-full mt-4"
              disabled={cart.length === 0}
              onClick={handleUpdateOrder}
            >
              Update Order
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
