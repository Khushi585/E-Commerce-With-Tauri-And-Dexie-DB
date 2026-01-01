import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updateOrder,
} from "@/db/orderService";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { db } from "@/db/db";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // preview & edit
  const [previewOrder, setPreviewOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const data = await getAllOrders();

    // Enrich orders with user info so UI can show username instead of raw id
    const users = await db.users.toArray();
    const userMap = new Map(users.map((u) => [u.id, u]));
    const enriched = data.map((o) => ({
      ...o,
      user: userMap.get(o.userId) || null,
      userName: userMap.get(o.userId)?.name || String(o.userId),
    }));

    setOrders(enriched);
    setLoading(false);
  }

  async function loadProducts() {
    const p = await db.products.toArray();
    setProducts(p);
  }

  async function handleStatusChange(orderId, status) {
    await updateOrderStatus(orderId, status);
    loadOrders();
  }

  // Format date for display
  function formatDate(value) {
    const d = value ? new Date(value) : new Date();
    return d.toLocaleString();
  }



  // pagination calculations
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paged = orders.slice((page - 1) * pageSize, page * pageSize);

  // page numbers helper (compact for large page counts)
  const getPageNumbers = () => {
    if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    pages.push(1);
    if (page > 4) pages.push("...");

    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const navigate = useNavigate();

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="p-3">#{o.id}</td>
                  <td>{o.userName || o.user?.name || o.userId}</td>
                  <td>₹{o.total}</td>
                  <td>{o.status}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setPreviewOrder(o)}>
                        Preview
                      </Button>



                      <Select
                        value={o.status}
                        onValueChange={(v) => handleStatusChange(o.id, v)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-600">Page {page} of {totalPages}</div>

            <div className="flex items-center gap-1">
              {pageNumbers.map((pNum, idx) => (
                typeof pNum === "string" ? (
                  <span key={`dots-${idx}`} className="px-3 py-1 text-sm text-slate-500">{pNum}</span>
                ) : (
                  <button
                    key={`page-${pNum}`}
                    onClick={() => setPage(pNum)}
                    className={`px-3 py-1 rounded ${pNum === page ? "bg-indigo-600 text-white" : "bg-white border text-slate-700 hover:bg-slate-100"}`}
                    aria-current={pNum === page}
                  >
                    {pNum}
                  </button>
                )
              ))}
            </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {previewOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold">Your Company</div>
                <div className="text-sm text-slate-500">123 Commerce St, City, Country</div>
                <div className="text-sm text-slate-500">Phone: (000) 000-0000</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold">Invoice</div>
                <div className="text-sm text-slate-600">Order #{previewOrder.id}</div>
                <div className="text-sm text-slate-600">{formatDate(previewOrder.createdAt)}</div>
                <div className={`inline-block mt-2 px-3 py-1 text-xs rounded ${previewOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : previewOrder.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {previewOrder.status}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border p-3 rounded bg-slate-50">
                <h4 className="font-semibold mb-2">Bill To</h4>
                <div className="text-sm">{previewOrder.userName || previewOrder.user?.name || previewOrder.userId}</div>
                <div className="text-sm text-slate-500">{previewOrder.user?.email || '—'}</div>
                <div className="text-sm text-slate-500">{previewOrder.user?.country || '—'}</div>
              </div>
              <div className="border p-3 rounded">
                <h4 className="font-semibold mb-2">Payment</h4>
                <div className="text-sm text-slate-500">Method: {previewOrder.paymentMethod || '—'}</div>
                <div className="text-sm text-slate-500">Items: {(previewOrder.items?.length) || 0}</div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Unit Price</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewOrder.items?.map((it) => {
                    const unit = it.finalPrice || it.price || 0;
                    const line = unit * (it.qty || 0);
                    return (
                      <tr key={it.productId}>
                        <td className="py-3">
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-slate-500">ID: {it.productId}</div>
                        </td>
                        <td className="py-3">₹{Number(unit).toLocaleString()}</td>
                        <td className="py-3 text-center">{it.qty}</td>
                        <td className="py-3 text-right font-semibold">₹{Number(line).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-sm text-slate-600">
                  <div>Subtotal</div>
                  <div>₹{Number((previewOrder.items || []).reduce((s, it) => s + (it.finalPrice || it.price || 0) * (it.qty || 0), 0)).toLocaleString()}</div>
                </div>
                <div className="flex justify-between text-sm text-slate-600 mt-2">
                  <div>Tax</div>
                  <div>₹0</div>
                </div>
                <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t">
                  <div>Total</div>
                  <div>₹{Number(previewOrder.total || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <strong>Notes:</strong> {previewOrder.note || '—'}
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setPreviewOrder(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}



      {/* Inline note */}
      <p className="text-sm text-slate-500 mt-4">Tip: Use Preview to inspect an order and Edit to change items. Stock is validated when saving edits.</p>
    </div>
  );
}
