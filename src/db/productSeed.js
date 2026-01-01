import { db } from "./db";
import { detectCountry } from "./countryLogic";
import products from "./products.json";

export async function seedProducts() {
  const count = await db.products.count();
  if (count > 0) return;

  const transformed = products
    .filter((p) => p.id !== undefined && p.id !== null)
    .map((p) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      category: p.category,
      rating: p.rating,
      stock: p.stock,
      brand: p.brand,
      country: detectCountry(p),

      thumbnail: p.thumbnail,
      images: p.images,

      discountType: null,      
      discountValue: 0,
    }));

  await db.products.bulkPut(transformed);
}
