import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";
import _ from "lodash";

export default function Cart() {
  const { token, setCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced update (NO LOADER here)
  const debouncedUpdate = useRef(
    _.debounce((items) => {
      API.post(
        "/cart",
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => setCart(res.data))
        .catch(() => setError("❌ Failed to update cart. Try again."));
    }, 500)
  ).current;

  // ✅ Fetch cart from server
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setCart(res.data);
        setLocalCart(res.data);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [token, navigate, setCart]);

  // ✅ Save cart in localStorage
  useEffect(() => {
    if (localCart.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(localCart));
      const total = localCart.reduce(
        (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
        0
      );
      localStorage.setItem("cartTotal", total);
    } else {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTotal");
    }
  }, [localCart]);

  const removeItem = (id) => {
    const updated = localCart.filter((i) => i._id !== id);
    setLocalCart(updated);
    debouncedUpdate(updated);
  };

  const changeQuantity = (id, delta) => {
    const updated = localCart.map((i) => {
      if (i._id === id) {
        let newQty = (i.quantity || 1) + delta;
        if (newQty > (i.stock || 1)) {
          setError(`❌ Only ${i.stock} items available in stock`);
          newQty = i.stock || 1;
        } else setError("");
        return { ...i, quantity: Math.max(1, newQty) };
      }
      return i;
    });
    setLocalCart(updated);
    debouncedUpdate(updated);
  };

  const total = localCart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

  // ✅ Loader sirf fetch ke waqt
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        <FaShoppingCart className="w-7 h-7 text-green-600" /> Your Cart
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {localCart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg sm:text-xl py-20">
          🛒 Your cart is empty.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {localCart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-center border rounded-2xl p-4 sm:p-6 gap-4 bg-white shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 sm:gap-6 w-full md:w-1/2">
                <img
                  src={
                    item.image
                      ? `http://localhost:5000${item.image}`
                      : "/pexels-photo.webp"
                  }
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
                <div>
                  <p className="font-bold text-lg sm:text-xl">{item.name}</p>
                  <p className="text-green-600 font-semibold">
                    ${item.price ? item.price.toLocaleString() : "0"}
                  </p>
                  <p className="text-sm sm:text-base text-gray-500">
                    Available Quantity: {item.stock || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 bg-white rounded-xl px-3 py-2">
                <button
                  onClick={() => changeQuantity(item._id, -1)}
                  disabled={(item.quantity || 1) <= 1}
                  className="p-1 sm:p-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  <FaMinus />
                </button>
                <span className="font-medium text-lg">{item.quantity || 1}</span>
                <button
                  onClick={() => changeQuantity(item._id, 1)}
                  disabled={(item.quantity || 1) >= (item.stock || 1)}
                  className="p-1 sm:p-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  <FaPlus />
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-red-600 transition flex items-center gap-2"
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-6 gap-4 md:gap-0">
            <p className="text-2xl sm:text-3xl font-bold">
              Total:{" "}
              <span className="text-green-600">
                ${total.toLocaleString()}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 transition flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
