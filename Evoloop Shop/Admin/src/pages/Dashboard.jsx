import { useEffect, useState } from "react";
import API from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products?page=1&limit=1000");
      setProducts(data.products || []);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/products/categories");
      setCategories(data);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const averageStock = totalProducts ? Math.round(totalStock / totalProducts) : 0;
  const averagePrice = totalProducts
    ? (products.reduce((acc, p) => acc + p.price, 0) / totalProducts).toFixed(2)
    : 0;
  const highestPrice = products.length ? Math.max(...products.map(p => p.price)) : 0;
  const totalRevenue = 0;

  // Top 8 products for charts
  const topProducts = products.slice(0, 8);
  const productPricesData = topProducts.map(p => ({ name: p.name, price: p.price }));
  const stockLevelsData = topProducts.map(p => ({ name: p.name, stock: p.stock }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-red-600">📊</span> Product Dashboard
      </h1>
      <p className="text-gray-500 mb-6">Monitor your inventory and sales performance</p>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Products", value: totalProducts },
          { title: "Total Stock", value: totalStock },
          { title: "Total Value", value: `$${totalValue.toLocaleString()}` },
          { title: "Categories", value: categories.length },
          { title: "Average Stock", value: averageStock },
          { title: "Average Price", value: `$${averagePrice}` },
          { title: "Highest Price", value: `$${highestPrice}` },
          { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}` },
        ].map((card) => (
          <div key={card.title} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <h3 className="text-gray-500 text-sm mb-2">{card.title}</h3>
            <span className="font-bold text-lg">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Prices Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-700 font-semibold mb-4">Product Prices</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productPricesData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
                tickFormatter={(name) => (name.length > 15 ? name.slice(0, 15) + "..." : name)}
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-700 font-semibold mb-4">Stock Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelsData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
                tickFormatter={(name) => (name.length > 15 ? name.slice(0, 15) + "..." : name)}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
