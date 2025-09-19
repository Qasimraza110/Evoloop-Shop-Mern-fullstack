import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard, FaEye, FaTimes, FaSave } from "react-icons/fa";

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(null);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    API.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCartItems(res.data || []))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));

    API.get("/shipping/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setShipping(res.data))
      .catch(() => setShipping(null));
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleStripePay = async () => {
    const requiredFields = ["fullName","email","phone","address","city","postalCode","country"];
    for (let field of requiredFields) {
      if (!shipping?.[field]) {
        setMessage("❌ Please fill all required shipping fields.");
        return;
      }
    }

    try {
      setMessage("⏳ Processing...");
      if (!shipping._id) {
        await API.post("/shipping", shipping, { headers: { Authorization: `Bearer ${token}` } });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartTotal", total);

      const res = await API.post("/payments/create-checkout-session",
        { items: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = res.data.url;
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpdateShipping = async () => {
    if (!shipping) return;
    setUpdating(true);
    try {
      const res = await API.put(`/shipping/${shipping._id}`, shipping, { headers: { Authorization: `Bearer ${token}` } });
      setShipping(res.data);
      setMessage("✅ Shipping updated successfully");
      setModalOpen(false);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
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
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
            <FaShoppingCart className="text-green-600 w-8 h-8" /> Checkout
          </h2>
          <p className="text-xl sm:text-2xl font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg">
            Total: ${total.toLocaleString()}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-20">🛒 Your cart is empty.</p>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition">
                  <span className="font-medium">{item.name} × {item.quantity}</span>
                  <span className="font-bold text-green-600">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Shipping Section */}
            {!shipping || !shipping._id ? (
              <div className="border p-6 rounded-xl bg-gray-50 shadow-md">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Shipping Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { name: "fullName", type: "text", placeholder: "Full Name" },
                    { name: "email", type: "email", placeholder: "Email" },
                    { name: "phone", type: "text", placeholder: "Phone" },
                    { name: "address", type: "text", placeholder: "Address" },
                    { name: "city", type: "text", placeholder: "City" },
                    { name: "state", type: "text", placeholder: "State" },
                    { name: "postalCode", type: "text", placeholder: "Postal Code" },
                    { name: "country", type: "text", placeholder: "Country" },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={shipping?.[field.name] || ""}
                      onChange={handleChange}
                      className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-green-50 border p-4 rounded-xl text-green-800 text-center font-medium shadow">
                <span>✅ Shipping info saved</span>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <FaEye /> View / Edit
                </button>
              </div>
            )}

            {/* Stripe Button */}
            <button
              onClick={handleStripePay}
              className="w-full bg-blue-600 text-white py-4 rounded-xl mt-6 hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-3 font-semibold text-lg shadow-md"
            >
              <FaCreditCard className="w-5 h-5" /> Pay with Stripe
            </button>

            {message && <p className="text-center text-red-600 mt-4 font-medium">{message}</p>}
          </div>
        )}

        {/* Modal */}
        {modalOpen && shipping && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-lg animate-fadeIn">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Shipping Info</h3>
              <div className="space-y-3">
                {[
                  "fullName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "state",
                  "postalCode",
                  "country"
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, " $1")}:</label>
                    <input
                      type="text"
                      name={field}
                      value={shipping[field] || ""}
                      onChange={handleChange}
                      className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpdateShipping}
                disabled={updating}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold"
              >
                <FaSave /> {updating ? "Saving..." : "Update Shipping"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
