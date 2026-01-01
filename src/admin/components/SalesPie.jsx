import React from "react";

// Simple Donut using CSS conic-gradient
// props.data = [{ label, value, color }]
export default function SalesPie({ data = [], size = 200 }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-slate-500">No sales data</p>
      </div>
    );
  }

  // Build conic-gradient string
  let start = 0;
  const parts = data.map((d) => {
    const percent = (d.value / total) * 100;
    const from = start;
    const to = start + percent;
    start = to;
    return `${d.color || "#60a5fa"} ${from}% ${to}%`;
  });

  const gradient = `conic-gradient(${parts.join(", ")})`;

  return (
    <div className="flex items-center gap-6">
      <div
        style={{ width: size, height: size, background: gradient }}
        className="rounded-full relative flex items-center justify-center shadow"
      >
        {/* donut hole */}
        <div
          style={{ width: size * 0.56, height: size * 0.56 }}
          className="rounded-full bg-white flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-sm text-slate-500">Total</div>
            <div className="text-lg font-bold">₹{Number(total).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="flex-1">
        {data.map((d) => (
          <div className="flex items-center gap-3 mb-2" key={d.label}>
            <div
              className="w-4 h-4 rounded"
              style={{ background: d.color || "#60a5fa" }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{d.label}</div>
              <div className="text-sm text-slate-500">₹{Number(d.value).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
