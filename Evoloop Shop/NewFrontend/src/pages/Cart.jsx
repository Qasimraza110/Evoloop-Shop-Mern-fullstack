import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export default function Cart() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setItems(res.data);
        const simplified = res.data.map(i => ({
          id: i._id,
          quantity: i.quantity
        }));
        localStorage.setItem("cart", JSON.stringify(simplified));
      })
      .catch(() => navigate("/login"));
  }, [token, navigate]);

  const updateCart = (newItems) => {
    API.post("/cart", { items: newItems }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setItems(res.data);
        const simplified = res.data.map(i => ({
          id: i._id,
          quantity: i.quantity
        }));
        localStorage.setItem("cart", JSON.stringify(simplified));
      });
  };

  const removeItem = (id) => {
    const filtered = items.filter(i => i._id !== id);
    updateCart(filtered);
  };

  const changeQuantity = (id, delta) => {
    const updated = items.map(i => {
      if (i._id === id) {
        const newQty = i.quantity + delta;
        return { ...i, quantity: newQty > 0 ? newQty : 1 };
      }
      return i;
    });
    updateCart(updated);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        <FaShoppingCart className="w-7 h-7 text-green-600" /> Your Cart
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          🛒 Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row justify-between items-center border rounded-2xl p-4 gap-4 shadow-md hover:shadow-lg transition bg-white"
            >
              {/* Product Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image || "/assets/placeholder.png"}
                  alt={item.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 object-contain rounded-lg border"
                />
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQuantity(item._id, -1)}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-lg">{item.quantity}</span>
                <button
                  onClick={() => changeQuantity(item._id, 1)}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item._id)}
                className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto justify-center"
              >
                <FaTrash className="w-4 h-4" /> Remove
              </button>
            </div>
          ))}

          {/* Cart Total + Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-4 gap-4">
            <p className="text-2xl font-bold text-gray-800">
              Total: <span className="text-green-600">${total.toLocaleString()}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow-sm hover:bg-gray-300 transition justify-center"
              >
                <FaArrowLeft className="w-5 h-5" /> Continue Shopping
              </button>

              {/* Checkout */}
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
