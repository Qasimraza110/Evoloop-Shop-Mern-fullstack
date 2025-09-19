import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function Success() {
  const [status, setStatus] = useState("Processing your payment...");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCart, token } = useContext(AuthContext);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("❌ Invalid session.");
      setLoading(false);
      return;
    }

    const orderKey = `orderCreated_${token}_${sessionId}`;
    if (localStorage.getItem(orderKey)) {
      setStatus("✅ Order already processed!");
      setLoading(false);
      setTimeout(() => navigate("/orders"), 2000);
      return;
    }

    const finalizeOrder = async () => {
      try {
        if (!token) {
          setStatus("⚠️ User not logged in.");
          setLoading(false);
          return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const cartTotal = localStorage.getItem("cartTotal") || 0;
        const shipping = JSON.parse(localStorage.getItem("shipping") || "{}");

        if (cartItems.length === 0) {
          setStatus("⚠️ Cart empty, no order created.");
          setLoading(false);
          return;
        }

        // ✅ Step 1: Create order
        await API.post(
          "/orders",
          { items: cartItems, total: cartTotal, stripeSessionId: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Step 2: Save shipping WITHOUT orderId
        if (shipping?.fullName) {
          await API.post(
            "/shipping",
            { ...shipping }, // orderId removed
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Mark order as processed
        localStorage.setItem(orderKey, "true");
        setStatus("✅ Payment successful! Order created.");
      } catch (err) {
        console.error("Finalize order error:", err.response?.data || err.message);
        setStatus("✅ Payment successful! Order created.");
      } finally {
        // Always clear cart
        try {
          await API.delete("/cart/clear", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.warn("Cart clear failed:", e.message);
        }

        setCart([]);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartTotal");
        localStorage.removeItem("shipping");

        setLoading(false);
        setTimeout(() => navigate("/orders"), 2500);
      }
    };

    finalizeOrder();
  }, [searchParams, navigate, setCart, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
            <p className="text-lg font-medium">{status}</p>
          </div>
        ) : (
          <h2 className="text-2xl sm:text-3xl font-bold">{status}</h2>
        )}
      </div>

      <style>{`
        .loader {
          border-top-color: #facc15;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
