import { db } from "./db";

/* ================= GET CART ================= */
export async function getCart(userId) {
  if (!userId) return [];

  const items = await db.cart.where("userId").equals(userId).toArray();

  // Ensure discount fields exist (migration-safe)
  await Promise.all(
    items.map(async (item) => {
      let updates = {};
      let needsUpdate = false;

      if (typeof item.discountType === "undefined") {
        const product = await db.products.get(item.productId);
        updates.discountType = product?.discountType || null;
        needsUpdate = true;
      }

      if (typeof item.discountValue === "undefined") {
        const product = await db.products.get(item.productId);
        updates.discountValue = product?.discountValue || 0;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await db.cart.update(item.id, updates);
        Object.assign(item, updates);
      }
    })
  );

  // Attach current product stock for each cart item so UI and checkout use latest stock
  await Promise.all(
    items.map(async (it) => {
      const product = await db.products.get(it.productId);
      it.stock = product?.stock ?? 0;
    })
  );

  return items.map((it) => ({
    ...it,
    discountType: it.discountType || null,
    discountValue: Number(it.discountValue || 0),
    stock: it.stock ?? 0,
  }));
}

/* ================= ADD TO CART ================= */
export async function addToCart(userId, product) {
  if (!userId || !product?.id) {
    throw new Error("Invalid user or product");
  }

  // Fetch latest product snapshot from DB to avoid stale stock checks
  const prod = await db.products.get(product.id);
  if (!prod) {
    throw new Error("Product not found");
  }

  const existing = await db.cart
    .where("[userId+productId]")
    .equals([userId, product.id])
    .first();

  // 🔒 STOCK CHECK (CRITICAL)
  if (existing) {
    if (existing.qty >= prod.stock) {
      throw new Error("Stock limit reached");
    }

    await db.cart.update(existing.id, {
      qty: existing.qty + 1,
      discountType: prod.discountType || null,
      discountValue: prod.discountValue || 0,
      stock: prod.stock,
    });
  } else {
    if (prod.stock <= 0) {
      throw new Error("Out of stock");
    }

    await db.cart.add({
      userId,
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      thumbnail: prod.thumbnail || "",
      qty: 1,
      discountType: prod.discountType || null,
      discountValue: prod.discountValue || 0,
      stock: prod.stock,
    });
  }
}

/* ================= UPDATE QTY ================= */
export async function updateQty(cartId, qty) {
  // Validate against latest product stock
  const cartItem = await db.cart.get(cartId);
  if (!cartItem) return;

  const product = await db.products.get(cartItem.productId);
  const available = product?.stock ?? 0;

  if (qty <= 0) {
    await db.cart.delete(cartId);
    return;
  }

  if (qty > available) {
    throw new Error("Stock limit reached");
  }

  await db.cart.update(cartId, { qty, stock: available });
}

/* ================= REMOVE ================= */
export async function removeFromCart(cartId) {
  await db.cart.delete(cartId);
}

/* ================= CLEAR CART ================= */
export async function clearCart(userId) {
  await db.cart.where("userId").equals(userId).delete();
}
