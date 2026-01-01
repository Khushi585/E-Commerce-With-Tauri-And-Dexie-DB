export function getFinalPrice(price, discountType, discountValue) {
  if (!discountType || !discountValue) return price;

  if (discountType === "PERCENT") {
    return Math.max(
      0,
      Math.round(price - (price * discountValue) / 100)
    );
  }

  if (discountType === "FLAT") {
    return Math.max(0, price - discountValue);
  }

  return price;
}
