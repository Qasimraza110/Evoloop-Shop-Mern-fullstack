import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import _ from "lodash";

export default function Cart() {
  const { token, cart, setCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState([]);
  const [error, setError] = useState("");
  const debouncedUpdate = useRef(
    _.debounce((items) => {
      API.post("/cart", { items }, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setCart(res.data))
        .catch(() => setError("❌ Failed to update cart. Try again."));
    }, 500)
  ).current;

  useEffect(() => {
    if (!token) return;
    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setCart(res.data);
        setLocalCart(res.data);
      })
      .catch(() => navigate("/login"));
  }, [token, navigate, setCart]);

  const removeItem = (id) => {
    const updated = localCart.filter((i) => i._id !== id);
    setLocalCart(updated);
    debouncedUpdate(updated);
  };

  const changeQuantity = (id, delta) => {
    const updated = localCart.map((i) => {
      if (i._id === id) {
        let newQty = i.quantity + delta;

        //  Limit by stock
        if (newQty > i.stock) {
          setError(`❌ Only ${i.stock} items available in stock`);
          newQty = i.stock;
        } else {
          setError(""); // clear error if valid
        }

        return { ...i, quantity: Math.max(1, newQty) };
      }
      return i;
    });
    setLocalCart(updated);
    debouncedUpdate(updated);
  };

  const total = localCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        <FaShoppingCart className="w-7 h-7 text-green-600" /> Your Cart
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-lg text-center font-semibold">
          {error}
        </div>
      )}

      {localCart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          🛒 Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {localCart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row justify-between items-center border rounded-2xl p-5 gap-6 shadow-lg hover:shadow-2xl transition bg-white"
            >
              {/* Product Info */}
              <div className="flex items-center gap-5 w-full sm:w-1/2">
                <img
                  src={item.image || "/pexels-photo.webp"}
                  alt={item.name}
                  className="w-28 h-28 object-contain rounded-lg border bg-gray-50"
                />
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-green-600 font-semibold text-base">
                    ${item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: <span className="font-medium">{item.stock}</span>
                  </p>
                </div>
              </div>

              {/* Quantity Controls row */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2 shadow-inner">
                <button
                  onClick={() => changeQuantity(item._id, -1)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-200 transition"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus className="w-3 h-3" />
                </button>

                <span className="font-bold text-lg text-gray-800 w-8 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() => changeQuantity(item._id, 1)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-200 transition"
                  disabled={item.quantity >= item.stock}
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item._id)}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-xl shadow hover:bg-red-600 transition w-full sm:w-auto justify-center"
              >
                <FaTrash className="w-4 h-4" /> Remove
              </button>
            </div>
          ))}

          {/* Cart Total + Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-6 gap-6">
            <p className="text-2xl font-bold text-gray-800">
              Total: <span className="text-green-600">${total.toLocaleString()}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow hover:bg-gray-300 transition justify-center"
              >
                <FaArrowLeft className="w-5 h-5" /> Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-md transition w-full sm:w-auto"
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
