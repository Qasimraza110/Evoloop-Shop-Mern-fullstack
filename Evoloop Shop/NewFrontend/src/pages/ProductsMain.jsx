import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function ProductsMain() {
  const [products, setProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const productRefs = useRef({});

  // Fetch products once
  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  // Intersection Observer for scroll animations
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

  // Add to cart
  const addToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingProductId(product._id);

    try {
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentItems = res.data || [];
      const existingIndex = currentItems.findIndex(i => i._id === product._id);

      if (existingIndex !== -1) {
        currentItems[existingIndex].quantity += 1;
      } else {
        currentItems.push({ ...product, quantity: 1 });
      }

      await API.post(
        "/cart",
        { items: currentItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoadingProductId("success-" + product._id);

      setTimeout(() => setLoadingProductId(null), 2000);
    } catch (err) {
      console.error(err);
      setLoadingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p._id}
            ref={el => (productRefs.current[p._id] = el)}
            className="opacity-0 transform translate-y-8 transition-all duration-700 border rounded-lg shadow hover:shadow-lg overflow-hidden flex flex-col"
          >
            <div className="bg-gray-100 flex justify-center items-center h-48">
              <img
                src={p.image || "/pexels-photo.webp"}
                alt={p.name}
                className="object-contain h-full w-full"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
              <p className="text-gray-700 mb-4">${p.price.toLocaleString()}</p>

              <Link
                to={`/product/${p._id}`}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition-colors duration-200"
              >
                View Product
              </Link>

              <button
                onClick={() => addToCart(p)}
                disabled={loadingProductId === p._id}
                className={`mt-4 font-semibold py-2 px-4 rounded transition-colors duration-200
                  ${
                    loadingProductId === "success-" + p._id
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }
                `}
              >
                {loadingProductId === p._id
                  ? "Adding..."
                  : loadingProductId === "success-" + p._id
                  ? "✅ Added!"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll animation CSS */}
      <style>
        {`
          .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0px) !important;
          }
        `}
      </style>
    </div>
  );
}
