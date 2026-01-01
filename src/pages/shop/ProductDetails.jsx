import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { db } from "@/db/db";
import { addToCart } from "@/db/cardService";
import { addToWishlist } from "@/db/wishlistService";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  refreshCart()
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    async function loadProduct() {
      // Try fetching by param as-is (string) first — admin products may use string IDs
      let data = await db.products.get(id);

      // Fallback: if not found and id is numeric-like, try numeric key
      if (!data && !Number.isNaN(Number(id))) {
        data = await db.products.get(Number(id));
      }

      // Final fallback: scan all products and match by string equality to handle mixed key types
      if (!data) {
        const all = await db.products.toArray();
        data = all.find((p) => String(p.id) === String(id));
      }

      setProduct(data || null);
      setActiveImg(data?.images?.[0] || data?.thumbnail || "");
    }
    loadProduct();
  }, [id]);

  if (product === null) {
    return <p className="text-center mt-20">Product not found</p>;
  }

  if (!product) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT: IMAGES */}
        <div className="space-y-4">
          <Card className="p-4">
            <img
              src={activeImg}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </Card>

          <div className="flex gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImg(img)}
                className={`h-20 w-20 object-cover rounded border cursor-pointer ${
                  activeImg === img ? "border-indigo-600" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <p className="text-slate-500">{product.brand}</p>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-green-600">
              ⭐ {product.rating}
            </span>
            {product.stock === 0 ? (
              <span className="text-sm text-red-600 font-semibold">
                Out of stock
              </span>
            ) : (
              <span className="text-sm text-green-600">
                {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
              </span>
            )}
          </div>

          <p className="text-3xl font-bold">₹{product.price}</p>

          <p className="text-slate-600 leading-relaxed">
            {product.description ||
              "High-quality product curated for the best shopping experience."}
          </p>

          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
              onClick={async () => {
                try {
                  await addToCart(user.id, product);
                  refreshCart();
                  toast.success("Added to bag 🛍️");
                } catch (err) {
                  if (err?.message?.includes("Out of stock") || err?.message?.includes("Stock limit")) {
                    toast.error("Out of stock");
                  } else {
                    toast.error("Failed to add to bag");
                  }
                }
              }}
            >
              Add to Bag
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => addToWishlist(user.id, product)}
            >
              ❤️ Wishlist
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
