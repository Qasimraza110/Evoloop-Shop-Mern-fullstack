
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; 
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import Inventory from "./pages/Inventory";
import User from "./pages/User";


import { FaBoxOpen, FaShoppingCart, FaChartBar, FaUsers, FaBoxes, FaChartPie } from "react-icons/fa";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              Evoloop <span className="text-yellow-400">Admin</span>
            </h1>
            <button
              className="md:hidden text-xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          <nav className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaChartBar /> Dashboard
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaBoxOpen /> Products
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaShoppingCart /> Orders
            </Link>
            <Link
              to="/inventory"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaBoxes /> Inventory
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaChartPie /> Analytics
            </Link>
            <Link
              to="/user"
              className="flex items-center gap-2 hover:text-yellow-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers /> Users
            </Link>
          </nav>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Mobile Top Bar */}
          <header className="flex items-center justify-between bg-white shadow p-4 md:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-2xl">
              ☰
            </button>
            <h1 className="text-xl font-bold">Evoloop Admin</h1>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route
                path="/analytics"
                element={<h2 className="text-xl">Analytics (Coming Soon)</h2>}
              />
              <Route
                path="/users"
                element={<h2 className="text-xl">Users Management (Coming Soon)</h2>}
              />
              <Route path="/user" element={<User />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
