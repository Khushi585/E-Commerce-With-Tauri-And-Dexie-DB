import { db } from "./db";
import { getCart, clearCart } from "./cardService";
import { getFinalPrice } from "@/utils/price";

export async function placeOrder(userId) {
  const cartItems = await getCart(userId);

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Validate stock using fresh product data
  for (const item of cartItems) {
    const prod = await db.products.get(item.productId);
    if (!prod || prod.stock < item.qty) {
      throw new Error(`Not enough stock for ${item.name}`);
    }
  }

  const order = {
    userId,
    items: cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      discountType: item.discountType,
      discountValue: item.discountValue,
      finalPrice: getFinalPrice(
        item.price,
        item.discountType,
        item.discountValue
      ),
      qty: item.qty,
    })),
    total: cartItems.reduce(
      (sum, i) => sum + getFinalPrice(i.price, i.discountType, i.discountValue) * i.qty,
      0
    ),
    status: "Placed",
    createdAt: new Date(),
  };

  // Save order
  await db.orders.add(order);

  // Reduce product stock
  for (const item of cartItems) {
    const prod = await db.products.get(item.productId);
    const newStock = Math.max(0, (prod?.stock ?? 0) - item.qty);
    await db.products.update(item.productId, { stock: newStock });
  }

  // Clear cart
  await clearCart(userId);

  return order;
}

/* ================= USER ================= */
// Add an order object directly
export async function createOrder(order) {
  return db.orders.add({
    ...order,
    status: "PENDING",
    createdAt: Date.now(),
  });
}
export async function getOrderById(orderId) {
  const id = Number(orderId);

  if (Number.isNaN(id)) {
    console.error("Invalid orderId:", orderId);
    return null;
  }

  return await db.orders.get(id);
}


/* ================= ADMIN ================= */

// Admin → see all orders
export async function getAllOrders() {
  return db.orders.toArray();
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  if (!orderId || !status) return;
  return db.orders.update(orderId, { status });
}

// Update an order's items and adjust product stock accordingly
export async function updateOrder(orderId, newItems) {
  if (!orderId) throw new Error("Order id required");

  return db.transaction('rw', db.orders, db.products, async () => {
    const order = await db.orders.get(orderId);
    if (!order) throw new Error("Order not found");

    // Build old qty map
    const oldMap = new Map();
    (order.items || []).forEach((it) => {
      oldMap.set(it.productId, it.qty || 0);
    });

    // Validate and compute stock deltas
    for (const it of newItems) {
      const prod = await db.products.get(it.productId);
      if (!prod) throw new Error(`Product ${it.name} not found`);

      const oldQty = oldMap.get(it.productId) || 0;
      const delta = (it.qty || 0) - oldQty; // positive => reduce stock

      if (delta > 0 && prod.stock < delta) {
        throw new Error(`Not enough stock for ${it.name}`);
      }
    }

    // Apply stock changes
    for (const it of newItems) {
      const prod = await db.products.get(it.productId);
      const oldQty = oldMap.get(it.productId) || 0;
      const delta = (it.qty || 0) - oldQty;

      const newStock = (prod.stock || 0) - delta;
      await db.products.update(it.productId, { stock: Math.max(0, newStock) });
    }

    // For products removed in newItems, return stock that was reserved previously
    for (const [productId, oldQty] of oldMap.entries()) {
      const still = newItems.find((i) => i.productId === productId);
      if (!still && oldQty > 0) {
        const prod = await db.products.get(productId);
        await db.products.update(productId, { stock: (prod.stock || 0) + oldQty });
      }
    }

    // Recalculate finalPrice/total (respect product discount)
    const updatedItems = [];
    let total = 0;
    for (const it of newItems) {
      const prod = await db.products.get(it.productId);
      const finalPrice = prod
        ? getFinalPrice(prod.price, prod.discountType, prod.discountValue)
        : it.price;
      const lineFinal = finalPrice * (it.qty || 0);
      updatedItems.push({
        productId: it.productId,
        name: it.name,
        price: prod?.price ?? it.price,
        qty: it.qty,
        finalPrice,
      });
      total += lineFinal;
    }

    await db.orders.update(orderId, { items: updatedItems, total });

    return db.orders.get(orderId);
  });
}
