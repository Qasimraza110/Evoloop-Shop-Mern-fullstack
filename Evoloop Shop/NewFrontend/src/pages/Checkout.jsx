import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCartItems(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleStripePay = async () => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartTotal", total);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2">
            <FaShoppingCart className="text-green-600 w-7 h-7" /> Checkout
          </h2>
          <p className="text-xl sm:text-2xl font-semibold text-green-600">
            Total: ${total.toLocaleString()}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-20">🛒 Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-4 sm:p-5 border rounded-xl bg-gray-50 shadow-sm hover:shadow transition"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold text-green-600">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
 
            <button
              onClick={handleStripePay}
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl mt-6 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <FaCreditCard /> Pay with Stripe
            </button>

            {message && <p className="text-center text-red-600 mt-3">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
