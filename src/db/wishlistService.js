import { db } from "./db";

export const addToWishlist = async (userId, product) => {
  const exists = await db.wishlist
    .where({ userId, productId: product.id })
    .first();

  if (!exists) {
    return db.wishlist.add({
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,      // include discount details for consistency
      discountType: product.discountType || null,
      discountValue: product.discountValue || 0,    });
  }
};

export const getWishlist = (userId) =>
  db.wishlist.where("userId").equals(userId).toArray();

export const removeFromWishlist = async (productId) => {
  if (!productId) return;
  return db.wishlist.where("productId").equals(productId).delete();
};

