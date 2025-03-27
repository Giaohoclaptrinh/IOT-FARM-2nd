import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  // Dữ liệu mẫu cho biểu đồ
  const data = [
    { name: "Tháng 1", value: 400 },
    { name: "Tháng 2", value: 800 },
    { name: "Tháng 3", value: 600 },
    { name: "Tháng 4", value: 900 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Biểu đồ dữ liệu</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
