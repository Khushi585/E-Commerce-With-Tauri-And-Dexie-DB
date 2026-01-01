export function detectCountry(product) {
  const category = product.category?.toLowerCase() || "";

  // 🇮🇳 INDIA
  if (
    category === "beauty" ||
    category === "groceries"
  ) {
    return "IN";
  }

  // 🇨🇦 CANADA
  if (
    category === "furniture" ||
    category === "fragrances"
  ) {
    return "CA";
  }

  // fallback
  return "IN";
}
