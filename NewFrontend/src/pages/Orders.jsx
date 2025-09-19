import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { FaBox, FaClock, FaListUl, FaDollarSign } from "react-icons/fa";

export default function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    API.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-lg text-gray-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl p-5 shadow-md hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <FaBox className="text-green-600 w-5 h-5" />
                  <p className="font-semibold text-sm text-gray-700">
                    Order ID:
                  </p>
                </div>
                <span className="text-xs text-gray-500 truncate max-w-[120px]">
                  {order._id}
                </span>
              </div>

              {/* Date + Status */}
              <div className="flex justify-between items-center mb-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="mb-3">
                <p className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                  <FaListUl className="w-4 h-4 text-gray-600" /> Items:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} — $
                      {(item.price * item.quantity).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-3">
                <span className="flex items-center gap-1 font-bold text-gray-800">
                  <FaDollarSign className="w-4 h-4 text-green-600" /> Total:
                </span>
                <span className="text-green-600 font-extrabold text-lg">
                  ${order.total.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
