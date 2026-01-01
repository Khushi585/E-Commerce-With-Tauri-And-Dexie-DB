import Navbar from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getWishlist, removeFromWishlist } from "@/db/wishlistService";
import { addToCart } from "../../db/cardService";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function Wishlist() {
  const { refreshCart } = useCart();
  const { user } = useAuth();

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getWishlist(user.id).then(setItems);
    }
  }, [user]);

  const handleAddToBag = async (item) => {
    // Add to cart
    await addToCart(user.id, item);

    //  Remove from wishlist (ONLY productId)
    await removeFromWishlist(item.productId);

    //  Refresh wishlist UI
    setItems(await getWishlist(user.id));

    //  Refresh cart count
    refreshCart();

    toast.success("Added to bag 🛍️");
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setItems(await getWishlist(user.id));
    toast.info("Removed from wishlist");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">My Wishlist ❤️</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-3 p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="font-semibold">₹{item.price}</p>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddToBag(item)}>
                    Add to Bag
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
