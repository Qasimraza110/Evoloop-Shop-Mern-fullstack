import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function Success() {
  const [message, setMessage] = useState("Processing your payment...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCart, token } = useContext(AuthContext);

useEffect(() => {
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    setMessage("❌ Invalid session.");
    return;
  }

  //  Payment success
  setMessage("✅ Payment successful! Thank you for your order.");

  //  Fetch order from backend
  if (token) {
    API.get(`/orders/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Order found:", res.data);
      })
      .catch(() => {
        console.error("Order not found");
        setMessage("⚠️ Payment done but order not found.");
      });
  }

  // Clear cart
  API.delete("/cart/clear", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    if (setCart) setCart([]);
  });

  // Redirect home
  const timer = setTimeout(() => navigate("/orders"), 2500);
  return () => clearTimeout(timer);
}, [searchParams, navigate, setCart, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold">{message}</h2>
      </div>
    </div>
  );
}

