import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          to="/"
          className="text-2xl font-bold tracking-tight text-indigo-600"
        >
          ShopEase
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="hover:text-indigo-600">
            Products
          </Link>
          <Link to="/wishlist" className="hover:text-indigo-600">
            Wishlist
          </Link>
          <Link to="/my-orders" className="hover:text-indigo-600">
  Orders
</Link>

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          
          {/* BAG ICON */}
          <button
            onClick={() => navigate("/bag")}
            className="relative"
          >
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </button>

          {/* USER (desktop clickable) */}
          <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm hover:underline">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
          </Link>

          {/* USER (mobile) */}
          <button
            onClick={() => navigate("/profile")}
            className="sm:hidden p-2 rounded hover:bg-slate-100"
            aria-label="Profile"
          >
            <User className="h-6 w-6" />
          </button>

          {/* LOGOUT */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
