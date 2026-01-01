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

const [form, setForm] = useState({
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



  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setProducts(await getAllProductsForAdmin());
  }

  /* IMAGE → BASE64 */
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, thumbnail: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

await addProduct({
  ...form,
  price: Number(form.price),
      stock: Number(form.stock),
  discountValue: Number(form.discountValue || 0),
  discountType: form.discountType || null,
  thumbnail: form.thumbnail || null,
});

    loadProducts();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin – Products</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow"
      >
        <Input placeholder="ID" value={form.id}
          onChange={(e)=>setForm({...form,id:e.target.value})} required />

        <Input placeholder="Name" value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})} required />

        <Input placeholder="Price" type="number" value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})} required />

        <Input placeholder="Category" value={form.category}
          onChange={(e)=>setForm({...form,category:e.target.value})} />

        <Select value={form.country}
          onValueChange={(v)=>setForm({...form,country:v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="IN">India</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
          </SelectContent>
        </Select>

        {/* Stock  */}
        <Input
  type="number"
  placeholder="Stock Quantity"
  value={form.stock}
  onChange={(e) =>
    setForm({ ...form, stock: e.target.value })
  }
/>

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
    <SelectItem value="PERCENT">
      Percentage (%)
    </SelectItem>
    <SelectItem value="FLAT">
      Flat Amount (₹)
    </SelectItem>
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
    setForm({
      ...form,
      discountValue: e.target.value,
    })
  }
/>


        <input type="file" accept="image/*" onChange={handleImage} />

        {form.thumbnail && (
          <img src={form.thumbnail}
            className="h-20 w-20 object-cover rounded" />
        )}

        <Button className="col-span-2">Save Product</Button>
      </form>

      {/* LIST */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th>Img</th><th>Name</th><th>Price</th><th>Stock</th><th>Discount</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p=>(
            <tr key={p.id} className="border-b">
              <td><img src={p.thumbnail} className="h-12 w-12" /></td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                {p.discountType} {p.discountValue}
              </td>
              <td>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={()=>deleteProduct(p.id).then(loadProducts)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
