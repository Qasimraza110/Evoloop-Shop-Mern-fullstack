import { useEffect, useState } from "react";
import API from "../api";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [shipping, setShipping] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/users");
      setUsers(data || []);
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersAndShipping = async (userId) => {
    setModalLoading(true);
    try {
      const ordersRes = await API.get(`/orders/user/${userId}/orders`);
      const shippingRes = await API.get(`/orders/user/${userId}/shipping`);
      setOrders(ordersRes.data || []);
      setShipping(shippingRes.data || null);
    } catch (err) {
      console.error("Orders or Shipping fetch error:", err);
      setOrders([]);
      setShipping(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSeeOrders = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    fetchOrdersAndShipping(user._id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaBoxOpen className="inline text-yellow-500 mr-1" />;
      case "shipped": return <FaTruck className="inline text-blue-500 mr-1" />;
      case "delivered": return <FaCheckCircle className="inline text-green-500 mr-1" />;
      case "cancelled": return <FaTimesCircle className="inline text-red-500 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        👥 Users Management
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-600">{u._id}</td>
                  <td className="p-3 font-medium">{u.username}</td>
                  <td className="p-3 break-all text-blue-600">{u.email}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleSeeOrders(u)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      See Orders
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Orders & Shipping for {selectedUser.username}
            </h2>

            {modalLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Orders Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                    <FaBoxOpen className="text-yellow-500" /> Orders
                  </h3>

                  {orders.length === 0 ? (
                    <p className="text-gray-500">No orders found.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {orders.map((o) => (
                        <div
                          key={o._id}
                          className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-gray-800">
                              Order #{o._id.slice(-6)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(o.status)}`}>
                              {getStatusIcon(o.status)}
                              {o.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Total:</span> {o.total} PKR
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Placed:</span>{" "}
                            {new Date(o.createdAt).toLocaleDateString()}
                          </p>

                          {o.items && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700">Items:</p>
                              <ul className="ml-4 mt-1 space-y-1 text-sm">
                                {o.items.map((item, i) => (
                                  <li key={item._id || i} className="flex justify-between">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span className="text-green-600 font-medium">{item.price} PKR</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Section */}
                {shipping && (
                  <div className="mt-6 p-4 border rounded-lg shadow-md bg-blue-50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaTruck className="text-blue-500" /> Shipping Details
                    </h3>
                    <p><span className="font-medium">Full Name:</span> {shipping.fullName}</p>
                    <p><span className="font-medium">Email:</span> {shipping.email}</p>
                    <p><span className="font-medium">Phone:</span> {shipping.phone}</p>
                    <p>
                      <span className="font-medium">Address:</span> {shipping.address}, {shipping.city}, {shipping.state && shipping.state + ','} {shipping.postalCode}, {shipping.country}
                    </p>
                    {shipping.orderId && <p><span className="font-medium">Order ID:</span> {shipping.orderId}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
