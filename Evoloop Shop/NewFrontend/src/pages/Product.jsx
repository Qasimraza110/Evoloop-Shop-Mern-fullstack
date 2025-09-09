// src/pages/Product.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [inCartQty, setInCartQty] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setMessage("");

    const fetchAll = async () => {
      try {
        // fetch product
        const pResp = await API.get(`/products/${id}`);
        const prod = pResp.data;

        // fetch cart (if logged in) 
        let cartItems = [];
        if (token) {
          const cResp = await API.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          cartItems = cResp.data || [];
        }

        if (!mounted) return;
        setProduct(prod);
        const inCart = cartItems.find((i) => i._id === prod._id);
        setInCartQty(inCart ? inCart.quantity : 0);

        // clamp quantity to remaining
        const remaining = Math.max(0, (prod.stock || 0) - (inCart ? inCart.quantity : 0));
        setQuantity(remaining > 0 ? Math.min(1, remaining) : 1);
      } catch (err) {
        setMessage(err.response?.data?.message || err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, [id, token]);

  const remaining = product ? Math.max(0, (product.stock || 0) - inCartQty) : 0;

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setMessage("");
    if (quantity < 1) {
      setMessage("❌ Please select at least 1 item");
      return;
    }
    if (quantity > remaining) {
      setMessage(`❌ Only ${remaining} items left to add`);
      return;
    }

    setAdding(true);
    try {
      // get current cart, merge and send
      const cartResp = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const current = cartResp.data || [];
      const idx = current.findIndex((i) => i._id === product._id);

      if (idx !== -1) {
        current[idx].quantity = current[idx].quantity + quantity;
      } else {
        current.push({ _id: product._id, name: product.name, price: product.price, image: product.image || "", quantity });
      }

      const updateResp = await API.post("/cart", { items: current }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // update local inCartQty from returned cart
      const updatedCart = updateResp.data || [];
      const inCart = updatedCart.find((i) => i._id === product._id);
      setInCartQty(inCart ? inCart.quantity : 0);

      setMessage("✅ Product added to cart successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="p-4 text-center text-blue-600 font-semibold">Loading product...</p>;
  if (!product) return <p className="p-4 text-center text-red-600">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden h-96">
        <img src={product.image || "/pexels-photo.webp"} alt={product.name} className="object-contain h-full w-full" />
      </div>

      <div className="md:w-1/2 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-blue-600">{product.name}</h2>
        <p className="text-2xl text-gray-800 font-semibold">${product.price?.toLocaleString()}</p>
        <p className="text-gray-700">{product.description || "No description available."}</p>

        <div className="flex items-center gap-3 mt-2">
          <p className="text-sm text-gray-500">Stock: {product.stock ?? 0}</p>
          <p className="text-sm text-gray-500">• In cart: {inCartQty}</p>
          <p className="text-sm text-gray-500">• Remaining: {remaining}</p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <label className="font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            max={Math.max(1, remaining)}
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 1;
              setQuantity(Math.min(Math.max(1, v), Math.max(1, remaining)));
            }}
            className="border p-2 rounded w-20 text-center"
          />
        </div>

        <button
          onClick={addToCart}
          disabled={adding || remaining <= 0 || quantity > remaining}
          className={`mt-6 w-full md:w-auto font-semibold py-3 px-6 rounded transition-colors duration-200 ${
            adding || remaining <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-yellow-400 text-white"
          }`}
        >
          {adding ? "Adding..." : remaining <= 0 ? "Out of stock" : "Add to Cart"}
        </button>

        {message && <p className={`mt-4 font-medium text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </div>
    </div>
  );
}
