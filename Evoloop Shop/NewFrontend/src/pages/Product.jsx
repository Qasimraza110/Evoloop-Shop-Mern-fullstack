import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false); 

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => setMessage(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setAdding(true); // Start loading
    setMessage("");  // Clear previous messages

    try {
      const res = await API.get("/cart", { headers: { Authorization: `Bearer ${token}` } });
      const currentItems = res.data || [];
      const existingIndex = currentItems.findIndex(i => i._id === product._id);

      if (existingIndex !== -1) {
        currentItems[existingIndex].quantity += quantity;
      } else {
        currentItems.push({ ...product, quantity });
      }

      await API.post("/cart", { items: currentItems }, { headers: { Authorization: `Bearer ${token}` } });

      setMessage("✅ Product added to cart successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setAdding(false); // Stop loading
    }
  };

  if (loading) return <p className="p-4 text-center text-blue-600 font-semibold">Loading product...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden h-96">
        <img
          src={product.image || "/assets/placeholder.png"}
          alt={product.name}
          className="object-contain h-full w-full"
        />
      </div>

      {/* Product Details */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-blue-600">{product.name}</h2>
        <p className="text-2xl text-gray-800 font-semibold">${product.price.toLocaleString()}</p>
        <p className="text-gray-700">{product.description || "No description available."}</p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mt-4">
          <label className="font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="border p-2 rounded w-20 text-center"
          />
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={adding} 
          className={`mt-6 w-full md:w-auto font-semibold py-3 px-6 rounded transition-colors duration-200
            ${adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-yellow-400 text-white"}
          `}
        >
          {adding ? "Adding..." : "Add to Cart"} {/* ✅ Show adding */}
        </button>

        {/* Success / Error Message */}
        {message && (
          <p className={`mt-4 font-medium text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
