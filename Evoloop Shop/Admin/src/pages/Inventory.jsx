import { useEffect, useState } from "react";
import API from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await API.get("/products"); // no token
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Inventory fetch error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Inventory</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products in stock.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
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
                    {p.name}
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
