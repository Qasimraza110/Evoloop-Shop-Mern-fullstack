import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/products/featured");
        setFeatured(data || []);
      } catch (err) {
        console.error("featured:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-black text-white flex flex-col justify-center items-center h-[65vh] text-center px-6 md:px-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow">
          Welcome to <span className="text-yellow-400">Evoloop Shop</span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl text-white/90">
          Discover the latest gadgets, electronics, clothes, and accessories —
          top deals & fast shipping.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/products")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-yellow-600 font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded shadow animate-pulse"
                >
                  <div className="h-40 bg-gray-200 mb-3 rounded" />
                  <div className="h-4 bg-gray-200 mb-2 w-3/4 rounded" />
                  <div className="h-4 bg-gray-200 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-gray-500">No featured products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p, i) => (
                <div
                  key={p._id}
                  className="relative bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
                >
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {i % 2 === 0 ? "🔥 Hot Deal" : "⭐ Best Seller"}
                  </span>

                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={p.image || "/pexels-photo.webp"}
                      alt={p.name}
                      className="object-contain h-full w-full"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="text-yellow-600 font-bold mb-2">
                      ${p.price}
                    </div>
                    <div className="mt-auto">
                      <Link
                        to={`/product/${p._id}`}
                        className="inline-block w-full text-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div className="p-6 text-center border rounded shadow-sm">
            <h3 className="font-semibold mb-2">🚚 Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="p-6 text-center border rounded shadow-sm">
            <h3 className="font-semibold mb-2">💳 Secure Payments</h3>
            <p className="text-sm text-gray-600">
              Stripe & encrypted checkout
            </p>
          </div>
          <div className="p-6 text-center border rounded shadow-sm">
            <h3 className="font-semibold mb-2">📞 24/7 Support</h3>
            <p className="text-sm text-gray-600">We&apos;re here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
}
