import { useEffect, useState } from "react";
import API from "../api";
import { FaSearch } from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
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
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/products?page=1&limit=1000");
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/products/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories(["clothes","electronics","accessories","shoes","home","mobiles"]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      return alert("⚠️ Name, Price, and Category are required");
    }

    setSaving(true);
    try {
      const payload = { 
        ...form, 
        price: parseFloat(form.price), // convert to number
        stock: parseInt(form.stock), 
      };
      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post("/products", payload);
      }
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin — Manage Products
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg space-y-4 lg:col-span-1"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            step="0.01"
            placeholder="Price"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            min={0}
            placeholder="Stock Quantity"
            className="border p-2 rounded w-full focus:ring-yellow-400 focus:border-yellow-400"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="accent-yellow-400"
            />
            <span>Mark as Featured</span>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              {saving ? (editingId ? "Updating..." : "Saving...") : editingId ? "Update Product" : "Add Product"}
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

        {/* Product List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4">
          <div className="mb-4 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border rounded pl-10 pr-3 py-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length ? (
            <ul className="space-y-3">
              {filteredProducts.map((p) => (
                <li key={p._id} className="border rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() =>
                        setExpandedId(expandedId === p._id ? null : p._id)
                      }
                    >
                      {expandedId === p._id ? "Hide" : "See more"}
                    </button>
                  </div>

                  {expandedId === p._id && (
                    <div className="text-sm text-gray-600 space-y-2 mt-2">
                      <p><span className="font-semibold">Price:</span> ${p.price}</p>
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-32 h-32 object-contain border rounded" />
                      )}
                      <p>{p.description}</p>
                      <p>Stock: {p.stock}</p>
                      <p>Category: {p.category}</p>
                      {p.isFeatured && (
                        <span className="inline-block px-2 py-0.5 bg-yellow-400 text-black rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
