import { useEffect, useState } from "react";
import API from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/products"); // no token
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Inventory fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📦 Inventory
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products in stock.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-center">Stock</th>
                <th className="p-2 text-center">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={p.image || "https://via.placeholder.com/30"}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="truncate max-w-[250px] md:max-w-full">
                      {p.name}
                    </span>
                  </td>
                  <td className="p-2 text-center">{p.stock}</td>
                  <td className="p-2 text-center">${p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
