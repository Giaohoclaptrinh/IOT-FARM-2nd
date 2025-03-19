import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../firebase/db.config';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const DeviceChart = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    const q = query(
      collection(db, 'device_data'),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc'),
      limit(24)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map(doc => ({
        ...doc.data(),
        time: new Date(doc.data().timestamp.seconds * 1000).toLocaleTimeString()
      })).reverse();
      setData(newData);
    });

    return () => unsubscribe();
  }, [deviceId]);

  const toggleFullscreen = () => {
    const element = document.getElementById(`chart-${deviceId}`);
    if (!document.fullscreenElement) {
      element.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      id={`chart-${deviceId}`} 
      className={`bg-white p-4 rounded-lg shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Thống kê thiết bị</h3>
        <button
          onClick={toggleFullscreen}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={isFullscreen ? "90vh" : 400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Nhiệt độ" />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Độ ẩm" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceChart;