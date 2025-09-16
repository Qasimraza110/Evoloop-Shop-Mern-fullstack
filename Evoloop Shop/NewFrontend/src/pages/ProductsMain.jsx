import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { FaMinus, FaPlus, FaSearch } from "react-icons/fa";

export default function ProductsMain() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [addingMap, setAddingMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [expandedTitles, setExpandedTitles] = useState({}); 

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/products/categories");
      setCategories(
        data && data.length
          ? data
          : ["clothes", "electronics", "accessories", "shoes", "home"]
      );
    } catch (err) {
      console.error("categories:", err);
      setCategories(["clothes", "electronics", "accessories", "shoes", "home"]);
    }
  };

  const fetchProducts = async (
    pageNumber = 1,
    searchQuery = "",
    categoryFilter = "all"
  ) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/products?page=${pageNumber}&limit=9&search=${encodeURIComponent(
          searchQuery
        )}&category=${categoryFilter}`
      );
      const payload = res.data || {};
      let fetchedProducts = payload.products || [];

     
      if (priceFilter === "under50")
        fetchedProducts = fetchedProducts.filter((p) => p.price < 50);
      if (priceFilter === "50to100")
        fetchedProducts = fetchedProducts.filter(
          (p) => p.price >= 50 && p.price <= 100
        );
      if (priceFilter === "above100")
        fetchedProducts = fetchedProducts.filter((p) => p.price > 100);

if (searchQuery) {
  const fuse = (await import("fuse.js")).default;
  const fuseSearch = new fuse(fetchedProducts, {
    keys: ["name", "description", "category"],
    threshold: 0.6,       
    distance: 100,        
    minMatchCharLength: 2 
  });
  fetchedProducts = fuseSearch.search(searchQuery).map((r) => r.item);
}

      setProducts(fetchedProducts);
      setTotalPages(payload.totalPages || 1);

      const q = {};
      fetchedProducts.forEach((p) => (q[p._id] = 0));
      setQuantities(q);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, search, category);
  }, [search, category, priceFilter]);

  useEffect(() => {
    fetchProducts(page, search, category);
  }, [page]);

  const updateQuantity = (id, change, stock) => {
    setQuantities((prev) => {
      const newQty = Math.min(Math.max((prev[id] || 0) + change, 0), stock || 9999);
      return { ...prev, [id]: newQty };
    });
  };

  const addToCart = async (product) => {
    if (!token) return navigate("/login");
    const qty = quantities[product._id] || 1;
    if (qty > product.stock) return;

    setAddingMap((m) => ({ ...m, [product._id]: "loading" }));
    try {
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentItems = res.data || [];
      const idx = currentItems.findIndex((i) => i._id === product._id);
      if (idx !== -1) currentItems[idx].quantity += qty;
      else currentItems.push({ ...product, quantity: qty });

      await API.post(
        "/cart",
        { items: currentItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddingMap((m) => ({ ...m, [product._id]: "success" }));
      setTimeout(() => {
        setAddingMap((m) => {
          const copy = { ...m };
          delete copy[product._id];
          return copy;
        });
      }, 1800);
    } catch (err) {
      console.error("Cart error:", err);
      setAddingMap((m) => ({ ...m, [product._id]: "error" }));
      setTimeout(() => {
        setAddingMap((m) => {
          const copy = { ...m };
          delete copy[product._id];
          return copy;
        });
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white p-4 rounded shadow space-y-6">
          {/* Search with icon */}
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="flex items-center border rounded px-2 py-2">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter Bar (Buttons) */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "under50", label: "Under $50" },
                { key: "50to100", label: "$50 - $100" },
                { key: "above100", label: "Above $100" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setPriceFilter(f.key)}
                  className={`px-3 py-1 rounded ${
                    priceFilter === f.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : products.length === 0 ? (
            <div className="bg-white rounded p-8 text-center text-gray-600">
              No products found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => {
                  const qty = quantities[p._id] ?? 0;
                  const addingState = addingMap[p._id];
                  const isExpanded = expandedTitles[p._id];

                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        <img
                          src={p.image || "/pexels-photo.webp"}
                          alt={p.name}
                          className="object-contain h-full w-full"
                        />
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        {/* Title with See More */}
                        <div className="mb-2">
                          <h3
                            className={`font-semibold text-lg ${
                              !isExpanded ? "line-clamp-2" : ""
                            }`}
                          >
                            {p.name}
                          </h3>

                          {p.name.length > 30 && (
                            <button
                              className="text-blue-600 text-xs font-medium mt-1 transition hover:text-blue-800 hover:underline"
                              onClick={() =>
                                setExpandedTitles((prev) => ({
                                  ...prev,
                                  [p._id]: !isExpanded,
                                }))
                              }
                            >
                              {isExpanded ? "▲ See Less" : "▼ See More"}
                            </button>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {p.description}
                        </p>

                        <div className="text-xl font-bold text-yellow-600 mb-3">
                          ${p.price}
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-2 mt-auto">
                          <div className="flex items-center bg-gray-100 rounded px-2 h-10">
                            <button
                              onClick={() => updateQuantity(p._id, -1, p.stock)}
                              className="text-gray-600 hover:text-red-500 px-2"
                            >
                              <FaMinus />
                            </button>
                            <span className="font-semibold px-2">{qty}</span>
                            <button
                              onClick={() => updateQuantity(p._id, 1, p.stock)}
                              className="text-gray-600 hover:text-green-500 px-2"
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <button
                            onClick={() => addToCart(p)}
                            disabled={addingState === "loading" || qty === 0}
                            className={`flex-1 h-10 rounded font-semibold flex items-center justify-center gap-2 ${
                              addingState === "loading"
                                ? "bg-gray-300"
                                : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                          >
                            {addingState === "loading"
                              ? "Adding..."
                              : addingState === "success"
                              ? "Added ✓"
                              : "🛒Cart"}
                          </button>
                        </div>

                        <Link
                          to={`/product/${p._id}`}
                          className="text-center py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((s) => Math.max(1, s - 1))}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="font-semibold">
                  Page {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

