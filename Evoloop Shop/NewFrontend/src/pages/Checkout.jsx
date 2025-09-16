import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard, FaDollarSign } from "react-icons/fa";

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCartItems(res.data))
      .catch(() => navigate("/login"));
  }, [token, navigate]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleStripePay = async () => {
    try {
      const res = await API.post(
        "/payments/create-checkout-session",
        { items: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <FaShoppingCart className="text-green-600 w-7 h-7" />
          <h2 className="text-3xl font-extrabold text-gray-800">Checkout</h2>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            🛒 Your cart is empty. Add some products before checkout.
          </p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  <span className="font-medium text-gray-800">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-green-600">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-xl border-t pt-4 mt-6">
              <span className="flex items-center gap-1 text-gray-800">
                <FaDollarSign className="w-5 h-5 text-green-600" /> Total:
              </span>
              <span className="text-green-600">
                ${total.toLocaleString()}
              </span>
            </div>

            {/* Stripe Pay Button */}
            <button
              onClick={handleStripePay}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg mt-6 shadow-md transition"
            >
              <FaCreditCard className="w-5 h-5" /> Pay with Stripe
            </button>

            {/* Error Message */}
            {message && (
              <p className="text-center text-red-600 mt-3 font-medium">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
