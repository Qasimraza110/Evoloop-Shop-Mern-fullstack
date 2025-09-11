import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminProducts from "./pages/AdminProducts";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dummy stats
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

  useEffect(() => {
    setStats({ products: 24, orders: 12, users: 8 });
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white p-6 transform transition-transform duration-300 md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              Evoloop <span className="text-yellow-400">Shop</span>
            </h1>
            <button
              className="md:hidden text-xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          <nav className="space-y-3">
            <Link
              to="/"
              className="block hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="block hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              Manage Products
            </Link>
            <Link
              to="/orders"
              className="block hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              Manage Orders
            </Link>
            <Link
              to="/users"
              className="block hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              Manage Users
            </Link>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "" : ""
          }`}
        >
          {/* Mobile Top Bar */}
          <header className="flex items-center justify-between bg-white shadow p-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold">Evoloop Admin</h1>
          </header>

          <main className="flex-1 p-6 md:p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h2 className="text-3xl font-semibold mb-2">
                      Welcome to <span className="text-yellow-400">Evoloop Admin Panel</span> 🚀
                    </h2>
                    <p className="text-gray-600 max-w-xl mb-4">
                      Here you can manage your products, orders, and users efficiently. Use the sidebar to navigate through different sections of the admin panel.
                    </p>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-yellow-400 text-3xl font-bold">{stats.products}</span>
                        <span className="text-gray-700 mt-1">Products</span>
                      </div>
                      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-yellow-400 text-3xl font-bold">{stats.orders}</span>
                        <span className="text-gray-700 mt-1">Orders</span>
                      </div>
                      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-yellow-400 text-3xl font-bold">{stats.users}</span>
                        <span className="text-gray-700 mt-1">Users</span>
                      </div>
                    </div>

                    {/* Extra Details */}
                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-xl font-semibold mb-3">Quick Overview</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Monitor product inventory and stock levels.</li>
                        <li>Review recent orders and order status.</li>
                        <li>Manage user accounts and access permissions.</li>
                        <li>Keep track of featured products and promotions.</li>
                      </ul>
                    </div>
                  </div>
                }
              />
              <Route path="/products" element={<AdminProducts />} />
              <Route
                path="/orders"
                element={<h2 className="text-xl">Orders Management (Coming Soon)</h2>}
              />
              <Route
                path="/users"
                element={<h2 className="text-xl">Users Management (Coming Soon)</h2>}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
