import React from "react";
function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        Welcome, <span className="text-yellow-500">Admin 🚀</span>
      </h2>
      <p className="text-gray-600 mt-2">
        Manage your shop efficiently from this admin dashboard.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-500">24</h3>
          <p className="text-gray-600">Products</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-500">12</h3>
          <p className="text-gray-600">Orders</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-500">8</h3>
          <p className="text-gray-600">Users</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500">
            Manage Products
          </button>
          <button className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500">
            Manage Orders
          </button>
          <button className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
