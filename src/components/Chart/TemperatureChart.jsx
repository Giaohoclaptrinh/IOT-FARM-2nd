import React, { useState, useEffect } from "react";
import { db } from "@/firebase/db.config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TemperatureChart = ({ deviceId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    const q = query(
      collection(db, `devices/${deviceId}/temperatureLogs`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        name: new Date(doc.data().timestamp.toDate()).toLocaleTimeString(),
        temp: doc.data().temp,
      }));
      setData(logs);
    });

    return () => unsubscribe();
  }, [deviceId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-bold mb-2">📊 Biểu đồ Nhiệt độ</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
