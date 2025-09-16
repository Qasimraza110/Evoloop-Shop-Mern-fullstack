import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";


const products = [
  { name: "Apple iPhone 14 Plus", price: 12000, stock: 10 },
  { name: "Lenovo HE05 Wireless Headphones", price: 900, stock: 10 },
  { name: "Men Jogger Shoes - Black", price: 600, stock: 50 },
  { name: "Pre-owned Slim Fit Jeans - Blue", price: 400, stock: 19 },
  { name: "HP Elite Dragonfly Folio G3 Laptop", price: 111000, stock: 10 },
  { name: "INDICODE JEANS T-shirts Basic - Black", price: 100, stock: 90 },
  { name: "SeeDete 32GB USB Flash Drives (3 Pack)", price: 30, stock: 100 },
  { name: "P9 Wireless Bluetooth Headphones", price: 500, stock: 89 },
  { name: "Mens Large Casual Sneakers", price: 0, stock: 0 },
];

const productStats = {
  totalProducts: products.length,
  totalStock: products.reduce((acc, p) => acc + p.stock, 0),
  totalValue: products.reduce((acc, p) => acc + p.stock * p.price, 0),
  categories: 1, 
  averageStock: Math.round(products.reduce((acc, p) => acc + p.stock, 0) / products.length),
  averagePrice: (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2),
  highestPrice: Math.max(...products.map(p => p.price)),
  totalRevenue: 0, 
};

// Prepare data for charts
const productPricesData = products.map(p => ({ name: p.name, price: p.price }));
const stockLevelsData = products.map(p => ({ name: p.name, stock: p.stock }));

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-red-600">📊</span> Product Dashboard
      </h1>
      <p className="text-gray-500 mb-6">Monitor your inventory and sales performance</p>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Products", value: productStats.totalProducts },
          { title: "Total Stock", value: productStats.totalStock },
          { title: "Total Value", value: `$${productStats.totalValue.toLocaleString()}` },
          { title: "Categories", value: productStats.categories },
          { title: "Average Stock", value: productStats.averageStock },
          { title: "Average Price", value: `$${productStats.averagePrice}` },
          { title: "Highest Price", value: `$${productStats.highestPrice}` },
          { title: "Total Revenue", value: `$${productStats.totalRevenue.toLocaleString()}` },
        ].map((card) => (
          <div key={card.title} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <h3 className="text-gray-500 text-sm mb-2">{card.title}</h3>
            <span className="font-bold text-lg">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Prices Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-700 font-semibold mb-4">Product Prices</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productPricesData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
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
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
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
