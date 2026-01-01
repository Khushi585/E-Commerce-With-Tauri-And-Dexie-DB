import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateOrder } from "@/db/orderService";
import { toast } from "react-toastify";
import { getFinalPrice } from "@/utils/price";

export default function EditOrderModal({ order, onClose, onSaved, products }) {
  const [items, setItems] = useState(order.items || []);

  function changeQty(idx, qty) {
    const next = items.slice();
    const item = next[idx];
    const prod = products.find((p) => String(p.id) === String(item.productId));
    const oldQty = item.qty || 0;
    const desired = Number(qty);

    // calculate max allowed: oldQty + current stock
    const maxAllowed = oldQty + (prod?.stock ?? 0);
    if (desired > maxAllowed) {
      toast.error(`Only ${maxAllowed} available for ${item.name}`);
      return;
    }

    next[idx] = { ...item, qty: desired }; 
    setItems(next);
  }

  function removeItem(idx) {
    const next = items.slice();
    next.splice(idx, 1);
    setItems(next);
  }

  function addProduct(productId) {
    const prod = products.find((p) => String(p.id) === String(productId));
    if (!prod) return;
    const exists = items.find((i) => String(i.productId) === String(prod.id));
    if (exists) {
      toast.info("Product already in order");
      return;
    }
    if ((prod.stock || 0) <= 0) {
      toast.error("Product out of stock");
      return;
    }
    setItems([...items, { productId: prod.id, name: prod.name, qty: 1 }]);
  }

  async function save() {
    try {
      await updateOrder(order.id, items);
      toast.success("Order updated");
      onSaved();
    } catch (err) {
      toast.error(err?.message || "Failed to update order");
    }
  }

  const total = items.reduce((s, it) => {
    const prod = products.find((p) => String(p.id) === String(it.productId));
    const price = prod ? getFinalPrice(prod.price, prod.discountType, prod.discountValue) : (it.finalPrice || it.price || 0);
    return s + (it.qty || 0) * price;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Edit Order #{order.id}</h3>

        <div className="space-y-3">
          <div>
           <strong>User:</strong> {order.userName || order.user?.name || order.userId}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {items.map((it, idx) => (
              <div key={it.productId} className="flex items-center gap-3 border p-3 rounded">
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-slate-500">Product ID: {it.productId}</div>
                </div>

                <Input type="number" value={it.qty} onChange={(e)=>changeQty(idx, e.target.value)} className="w-24" />
                <Button variant="destructive" onClick={()=>removeItem(idx)}>Remove</Button>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <Select onValueChange={(v)=>addProduct(v)}>
                <SelectTrigger><SelectValue placeholder="Add product"/></SelectTrigger>
                <SelectContent>
                  {products.map(p=> (
                    <SelectItem value={String(p.id)} key={p.id}>{p.name} — ₹{p.price} — Stock: {p.stock}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-right font-semibold">Total: ₹{total}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
}
