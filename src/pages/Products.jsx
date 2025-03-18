import React, { useState, useEffect } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu sản phẩm
    const fakeProducts = [
      { id: 1, name: "Phân bón hữu cơ", price: "200.000 VND" },
      { id: 2, name: "Hạt giống lúa", price: "150.000 VND" },
      { id: 3, name: "Máy bơm tưới", price: "2.000.000 VND" },
    ];
    setProducts(fakeProducts);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Quản lý Sản phẩm</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên Sản Phẩm</th>
            <th className="border p-2">Giá</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border p-2">{product.id}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
