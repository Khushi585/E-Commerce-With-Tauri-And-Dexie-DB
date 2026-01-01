// src/db/productService.js
import { db } from "./db";
/* ================= ADMIN ================= */

// Admin sees ALL products
export async function getAllProductsForAdmin() {
  return db.products.toArray();
}

// Add product (admin)
export async function addProduct(product) {
  if (!product?.id || !product?.name) {
    throw new Error("Invalid product data");
  }

  return db.products.put(product); // put = add or update
}

// Delete product
export async function deleteProduct(productId) {
  if (!productId) return;
  return db.products.delete(productId);
}

/* ================= USER ================= */

// User sees country-specific + ALL
export async function getProductsForUser(user) {
  if (!user) return [];

  if (user.role === "admin") {
    return getAllProductsForAdmin();
  }

  return db.products
    .filter(
      (p) =>
        p.country === "ALL" ||
        p.country === user.country
    )
    .toArray();
}

