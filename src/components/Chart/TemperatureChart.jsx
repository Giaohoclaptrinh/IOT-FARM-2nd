import React, { useState, useEffect } from "react";
import { db } from "@/firebase/db.config";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CalendarIcon, ExpandIcon } from "lucide-react"; // Thêm icon lịch và mở rộng
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css";

const TemperatureChart = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState("1w"); // Mặc định 1 tuần
  const [isFullScreen, setIsFullScreen] = useState(false); // Quản lý chế độ full màn hình
  const [showDatePicker, setShowDatePicker] = useState(false); // Quản lý hiển thị DatePicker
  const [selectedDate, setSelectedDate] = useState(null); // Lưu trữ ngày được chọn

  useEffect(() => {
    if (!deviceId) return;

    const now = new Date();
    let startTime;
    switch (timeRange) {
      case "1h": startTime = new Date(now.getTime() - 1 * 60 * 60 * 1000); break;
      case "3h": startTime = new Date(now.getTime() - 3 * 60 * 60 * 1000); break;
      case "12h": startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000); break;
      case "1d": startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case "3d": startTime = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); break;
      case "1w": startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      default: startTime = new Date(0);
    }

    const q = query(
      collection(db, `devices/${deviceId}/temperatureLogs`),
      where("timestamp", ">=", startTime),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => {
        const timestamp = doc.data().timestamp.toDate();
        return {
          name: timestamp.toLocaleTimeString(),
          temp1: doc.data().temp1 !== undefined ? doc.data().temp1 : 12, // Giá trị mặc định nếu không có
          temp2: doc.data().temp2 !== undefined ? doc.data().temp2 : 33, // Giá trị mặc định nếu không có
          temp3: doc.data().temp3 !== undefined ? doc.data().temp3 : 22, // Giá trị mặc định nếu không có
        };
      });
      console.log(logs); // Kiểm tra dữ liệu
      setData(logs);
    });

    return () => unsubscribe();
  }, [deviceId, timeRange]);

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mt-4 ${isFullScreen ? "fixed top-0 left-0 w-full h-full z-50 bg-white" : ""}`}>
      {/* Thanh chọn thời gian */}
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-lg font-bold ${!showDatePicker ?('hidden '):('')}`}>🌡️ Soil Temperature (Last {timeRange})</h2>
        <div className="flex space-x-2  ml-auto">
          {["1h", "3h", "12h", "1d", "3d", "1w", "Custom"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-semibold rounded ${timeRange === range ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {range}
            </button>
          ))}
          <button onClick={() => setShowDatePicker(!showDatePicker)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded">
            <CalendarIcon size={18} />
          </button>
          {!showDatePicker && (
            <div className="">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded">
            <ExpandIcon size={18} />
          </button>
        </div>
      </div>

      {/* Biểu đồ nhiệt độ */}
      <ResponsiveContainer width="100%" height={isFullScreen ? 500 : 300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp1" stroke="#ff7300" strokeWidth={2} name="Cảm biến 1" />
          <Line type="monotone" dataKey="temp2" stroke="#0088FE" strokeWidth={2} name="Cảm biến 2" />
          <Line type="monotone" dataKey="temp3" stroke="#00C49F" strokeWidth={2} name="Cảm biến 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
