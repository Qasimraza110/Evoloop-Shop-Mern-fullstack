import { useEffect, useState } from "react";
import API from "../api";
import {
  FaTshirt,
  FaMobileAlt,
  FaHatCowboy,
  FaShoePrints,
  FaCouch,
  FaUserShield,
} from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    isFeatured: false,
    stock: 0,
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/products?page=1&limit=1000");
      setProducts(data.products || data || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/products/categories");
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category)
      return alert("⚠️ Fill required fields");
    setSaving(true);
    try {
      if (editingId) await API.put(`/products/${editingId}`, form);
      else await API.post("/products", form);

      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        isFeatured: false,
        stock: 0,
        category: "",
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      price: p.price || "",
      description: p.description || "",
      image: p.image || "",
      isFeatured: !!p.isFeatured,
      stock: p.stock || 0,
      category: p.category || "",
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "clothes":
        return <FaTshirt className="text-blue-500" />;
      case "electronics":
        return <FaMobileAlt className="text-green-500" />;
      case "accessories":
        return <FaHatCowboy className="text-purple-500" />;
      case "shoes":
        return <FaShoePrints className="text-orange-500" />;
      case "jackets":
        return <FaUserShield className="text-red-500" />;
      case "home":
        return <FaCouch className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin — Manage Products
      </h1>

      {/* Layout: Form (Left) + Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg space-y-4 lg:col-span-1"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border focus:ring-yellow-400 focus:border-yellow-400 p-2 rounded w-full transition"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="border focus:ring-yellow-400 focus:border-yellow-400 p-2 rounded w-full transition"
            required
          />
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock Quantity"
            className="border focus:ring-yellow-400 focus:border-yellow-400 p-2 rounded w-full transition"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border focus:ring-yellow-400 focus:border-yellow-400 p-2 rounded w-full transition"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.length
              ? categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))
              : ["clothes", "electronics", "accessories", "shoes", "jackets", "home"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  )
                )}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400 transition"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="accent-yellow-400"
            />
            <span>Mark as Featured</span>
          </label>

          <div className="flex gap-3 flex-wrap">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    price: "",
                    description: "",
                    image: "",
                    isFeatured: false,
                    stock: 0,
                    category: "",
                  });
                }}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product Cards Section */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col p-4 border rounded-xl shadow hover:shadow-lg transition bg-white"
                >
                  {/* Image */}
                  <img
                    src={p.image || "/pexels-photo.webp"}
                    alt={p.name}
                    className="w-full h-40 object-contain rounded-lg border mb-3"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-800">{p.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      {getCategoryIcon(p.category)} {p.category}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      💲 {p.price} | Stock: {p.stock}
                    </div>
                    {p.isFeatured && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-400 text-black rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
