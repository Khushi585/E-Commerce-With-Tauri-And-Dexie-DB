import { useEffect, useState } from "react";
import {
  getAllProductsForAdmin,
  addProduct,
  deleteProduct,
} from "@/db/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    country: "ALL",
    stock: "",
    thumbnail: "",
    discountType: "",
    discountValue: "",
  });

  /* LOAD PRODUCTS */
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await getAllProductsForAdmin();
    setProducts(data || []);
    setLoading(false);
  }

  /* FILE UPLOAD */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, thumbnail: reader.result }));
    reader.readAsDataURL(file);
  }

  /* ADD / UPDATE PRODUCT */
  async function handleSubmit(e) {
    e.preventDefault();

    await addProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      // normalize discount fields
      discountValue: Number(form.discountValue || 0),
      discountType: form.discountType || null,
      thumbnail: form.thumbnail || null,
    });

    setForm({
      id: "",
      name: "",
      price: "",
      category: "",
      country: "ALL",
      stock: "",
      thumbnail: "",
      discountType: "",
      discountValue: "",
    });

    loadProducts();
  }

  /* DELETE */
  async function handleDelete(id) {
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-5 gap-3 mb-8"
      >
        <Input
          placeholder="ID"
          value={form.id}
          onChange={(e) =>
            setForm({ ...form, id: e.target.value })
          }
          required
        />

        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <Input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <Input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <Input
          type="number"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <Select
          value={form.country}
          onValueChange={(v) =>
            setForm({ ...form, country: v })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Countries</SelectItem>
            <SelectItem value="IN">India</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
          </SelectContent>
        </Select>

        {/* DISCOUNT TYPE */}
        <Select
          value={form.discountType}
          onValueChange={(v) =>
            setForm({ ...form, discountType: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Discount Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENT">Percentage (%)</SelectItem>
            <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
          </SelectContent>
        </Select>

        {/* DISCOUNT VALUE */}
        <Input
          placeholder={
            form.discountType === "PERCENT"
              ? "Discount %"
              : "Discount Amount"
          }
          type="number"
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: e.target.value })
          }
        />

        <div className="col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="preview"
              className="h-20 w-20 mt-2 object-cover rounded"
            />
          )}
        </div>

        <div className="col-span-3 flex gap-2">
          <Button type="submit" className="h-11">
            {form.id ? "Update Product" : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setForm({
                id: "",
                name: "",
                price: "",
                category: "",
                country: "ALL",
                thumbnail: "",
                discountType: "",
                discountValue: "",
              })
            }
          >
            Clear
          </Button>
        </div>
      </form>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="relative">
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Country</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">
                    <img
                      src={p.thumbnail || "/placeholder.png"}
                      alt={p.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.country}</td>
                  <td>
                    {p.discountType} {p.discountValue}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setForm({
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
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
      )}
    </div>
  );
}


