import { useEffect, useState } from "react";
import API from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/orders/all");
      setOrders(data || []);
    } catch (err) {
      console.error("Admin fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📦 Manage Orders
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-gray-600">
                    ID: {order._id.slice(-6)}
                  </span>
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      order.status === "delivered"
                        ? "bg-red-100 text-red-600"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="mb-2">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="text-gray-700">
                      {it._id?.name || it.name} × {it.quantity}
                    </div>
                  ))}
                </div>
                <div className="font-semibold mb-2">
                  Total: ${order.total.toFixed(2)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(order._id, "shipped")}
                    disabled={order.status !== "pending"}
                    className={`px-3 py-1 rounded text-xs font-semibold text-white transition ${
                      order.status === "pending"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Ship
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, "delivered")}
                    disabled={order.status === "delivered"}
                    className={`px-3 py-1 rounded text-xs font-semibold text-white transition ${
                      order.status === "delivered"
                        ? "bg-red-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border text-sm min-w-[700px] md:min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono">{order._id.slice(-6)}</td>
                    <td className="p-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="whitespace-nowrap">
                          {it._id?.name || it.name} × {it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        order.status === "delivered"
                          ? "text-red-600"
                          : order.status === "shipped"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(order._id, "shipped")}
                        disabled={order.status !== "pending"}
                        className={`w-24 px-3 py-1 rounded text-xs font-semibold text-white transition ${
                          order.status === "pending"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Ship
                      </button>

                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        disabled={order.status === "delivered"}
                        className={`w-24 px-3 py-1 rounded text-xs font-semibold text-white transition ${
                          order.status === "delivered"
                            ? "bg-red-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        Deliver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

