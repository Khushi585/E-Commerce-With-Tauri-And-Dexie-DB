import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Shop Smarter. <br /> Live Better.
            </h1>

            <p className="text-slate-300 text-lg">
              Premium products curated specially for{" "}
              <span className="font-semibold text-white">
                {user?.country === "CA" ? "Canada 🇨🇦" : "India 🇮🇳"}
              </span>
            </p>

            <Button
              size="lg"
              className="bg-white text-black hover:bg-slate-200"
              onClick={() => navigate("/products")}
            >
              Shop Now →
            </Button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
              alt="Ecommerce banner"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>
{/* ================= CATEGORY SECTION ================= */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-semibold mb-12 text-center">
    Explore Categories
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {[
      {
        title: "Beauty",
        img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      },
      {
        title: "Fragrances",
        img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539",
      },
      {
        title: "Furniture",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      },
      {
        title: "Groceries",
        img: "https://images.unsplash.com/photo-1542838132-92c53300491e",
      },
    ].map((cat) => (
      <div
        key={cat.title}
        onClick={() => navigate(`/products?category=${cat.title}`)}
        className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg
                   hover:shadow-2xl transition relative"
      >
        <img
          src={cat.img}
          alt={cat.title}
          className="h-56 w-full object-cover group-hover:scale-105 transition"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <h3 className="text-white text-xl font-semibold">
            {cat.title}
          </h3>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* ================= FEATURES STRIP ================= */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl">🚚</div>
            <p className="font-medium mt-2">Fast Delivery</p>
          </div>

          <div>
            <div className="text-3xl">🔒</div>
            <p className="font-medium mt-2">Secure Payments</p>
          </div>

          <div>
            <div className="text-3xl">⭐</div>
            <p className="font-medium mt-2">Top Rated Products</p>
          </div>

          <div>
            <div className="text-3xl">💬</div>
            <p className="font-medium mt-2">24/7 Support</p>
          </div>
        </div>
      </section>
    </>
  );
}
