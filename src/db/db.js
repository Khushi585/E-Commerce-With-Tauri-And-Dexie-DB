import Dexie from "dexie";

export const db = new Dexie("ecommerceDB");

db.version(2).stores({
  cart: "++id, userId, productId, [userId+productId]",
  wishlist: "++id, userId, productId, [userId+productId]",
   products:
    "id, name, price, category, country,stock, discountType, discountValue",
  users: "++id, email, role",
  orders: "++id, userId, createdAt",
});

