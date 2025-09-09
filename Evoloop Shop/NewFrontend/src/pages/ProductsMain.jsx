// src/pages/ProductsMain.jsx
import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function ProductsMain() {
  const [products, setProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const productRefs = useRef({});
  const [quantities, setQuantities] = useState({});
  const sentinelRef = useRef(null);

  // Fetch products
  const fetchProducts = async (pageNumber = 1) => {
    if (isFetching || pageNumber > totalPages) return;
    setIsFetching(true);

    try {
      const res = await API.get(`/products?page=${pageNumber}&limit=12`);
      const data = res.data;

      setProducts(prev => [...prev, ...data.products]);
      setTotalPages(data.totalPages);

      const newQuantities = {};
      data.products.forEach(p => (newQuantities[p._id] = 1));
      setQuantities(prev => ({ ...prev, ...newQuantities }));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // First page load
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && page < totalPages) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchProducts(nextPage);
            return nextPage;
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFetching, page, totalPages]);

  // Fade-in animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(productRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products]);

  // Update quantity
  const updateQuantity = (id, change, stock) => {
    setQuantities(prev => {
      let newQty = (prev[id] || 1) + change;
      if (newQty < 1) newQty = 1;
      if (newQty > stock) newQty = stock;
      return { ...prev, [id]: newQty };
    });
  };

  // Add to cart
  const addToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const qty = quantities[product._id] || 1;
    if (qty > product.stock) return;

    setLoadingProductId(product._id);

    try {
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentItems = res.data || [];
      const existingIndex = currentItems.findIndex(i => i._id === product._id);

      if (existingIndex !== -1) {
        currentItems[existingIndex].quantity += qty;
      } else {
        currentItems.push({ ...product, quantity: qty });
      }

      await API.post(
        "/cart",
        { items: currentItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoadingProductId("success-" + product._id);
      setTimeout(() => setLoadingProductId(null), 2000);
    } catch (err) {
      console.error("Cart error:", err);
      setLoadingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p, idx) => {
          const qty = quantities[p._id] || 1;
          const overStock = qty > p.stock;

          return (
            <div
              key={`${p._id}-${idx}`}
              ref={el => (productRefs.current[p._id + "-" + idx] = el)}
              className="opacity-0 transform translate-y-8 transition-all duration-700 border rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col bg-white"
            >
              <div className="bg-gray-100 flex justify-center items-center h-48">
                <img
                  src={p.image || "/pexels-photo.webp"}
                  alt={p.name}
                  className="object-contain h-full w-full"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-gray-700 mb-3">${p.price.toLocaleString()}</p>

                {/* Quantity & Add to Cart */}
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    {/* Quantity */}
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 h-10 sm:w-32">
                      <button
                        onClick={() => updateQuantity(p._id, -1, p.stock)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="font-semibold text-lg text-gray-800">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(p._id, 1, p.stock)}
                        className="text-gray-600 hover:text-green-500 transition-colors"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(p)}
                      disabled={loadingProductId === p._id || overStock}
                      className={`flex-1 font-semibold rounded-lg transition-colors duration-200 text-center flex items-center justify-center gap-2
                        ${
                          overStock
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : loadingProductId === "success-" + p._id
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }
                      `}
                    >
                      {overStock
                        ? "❌ Stock exceeded"
                        : loadingProductId === p._id
                        ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Adding...
                          </>
                        )
                        : loadingProductId === "success-" + p._id
                        ? "✅ Added!"
                        : "Add to Cart"}
                    </button>
                  </div>

                  {/* View Product */}
                  <Link
                    to={`/product/${p._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors duration-200"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite scroll loader */}
      <div ref={sentinelRef} className="h-10"></div>
      {isFetching && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <style>{`
        .fade-in-up {
          opacity: 1 !important;
          transform: translateY(0px) !important;
        }
      `}</style>
    </div>
  );
}
