import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-slate-700 transition";

  const activeClass =
    "bg-slate-800 text-white";

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen p-4">
      {/* Logo / Title */}
      <h2 className="text-xl font-bold mb-8 text-center">
        Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
