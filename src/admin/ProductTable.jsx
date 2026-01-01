import { Button } from "@/components/ui/button";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full bg-white shadow rounded">
      <thead>
        <tr className="border-b text-left">
          <th className="p-3">Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Country</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="p-3">
              <img
                src={p.thumbnail || "/placeholder.png"}
                className="h-12 w-12 rounded object-cover"
              />
            </td>

            <td>{p.name}</td>
            <td>₹{p.price}</td>
            <td>{p.stock}</td>
            <td>{p.country}</td>

            <td>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    onEdit({
                     id: p.id,
  name: p.name,
  price: String(p.price),
  category: p.category || "",
  country: p.country || "ALL",
  stock: String(p.stock || ""),
  thumbnail: p.thumbnail || "",
  discountType: p.discountType || "",
  discountValue: String(p.discountValue || ""),
                    })
                  }
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
